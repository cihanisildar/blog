import { Request, Response } from "express";
import { Post } from "../models/post.model";
import prisma from "../../prisma/prisma";
import { uploadToS3 } from "../utils/s3Utils";
import { awsS3BucketName, awsS3Region, s3 } from "../config/s3Config";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const allPosts = await prisma.post.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No posts found",
      });
    }

    return res.status(200).json({
      status: "success",
      posts: allPosts,
    });
  } catch (error: any) {
    console.error("Error fetching allPosts:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch allPosts",
      error: error.message,
    });
  }
};

const getLatestPosts = async (req: Request, res: Response) => {
  try {
    console.log("Fetching latest posts");
    const latestPosts = await prisma.post.findMany({
      // where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log("Fetched posts:", latestPosts);

    return res.status(200).json({
      status: "success",
      posts: latestPosts,
    });
  } catch (error: any) {
    console.error("Error fetching latest posts:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch latest posts",
      error: error.message,
    });
  }
};
const createPost = async (req: Request, res: Response): Promise<Response> => {
  const { title,description, content, published, length, tags = [] } = req.body;

  console.log("Body:", req.body);
  console.log("File details:", req.file);

  // Ensure tags is an array
  let parsedTags: { id: number; name: string }[] = [];
  try {
    if (typeof tags === "string") {
      parsedTags = JSON.parse(tags);
      if (!Array.isArray(parsedTags)) {
        throw new Error("Tags must be an array of objects");
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else {
      throw new Error("Tags must be an array or a JSON string");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid tags format",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  let mainImageUrl = "";
  let mainImageName = "";

  if (req.file) {
    try {
      const { imageUrl, filename } = await uploadToS3(
        req.file.buffer,
        req.file.mimetype,
        true
      );
      mainImageUrl = imageUrl;
      mainImageName = filename;
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to upload main image",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Extract and upload images from content
  const contentImageRegex = /<img[^>]+src="([^">]+)"/g;
  const contentImageUrls: string[] = [];
  const contentString = content as string;
  let match: RegExpExecArray | null;

  const matches: { start: number; end: number; src: string }[] = [];

  while ((match = contentImageRegex.exec(contentString)) !== null) {
    matches.push({
      start: match.index,
      end: contentImageRegex.lastIndex,
      src: match[1],
    });
  }

  let updatedContent = contentString;
  for (const { start, end, src } of matches.reverse()) {
    // Process in reverse to keep indexes correct
    if (src.startsWith("data:image")) {
      try {
        const base64Data = src.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        const mimeType = src.split(";")[0].split(":")[1];
        const { imageUrl } = await uploadToS3(buffer, mimeType, false, null);
        contentImageUrls.push(imageUrl);
        updatedContent = `${updatedContent.slice(
          0,
          start
        )}<img src="${imageUrl}"${updatedContent.slice(end)}`;
      } catch (error) {
        console.error("Failed to upload content image:", error);
      }
    } else {
      // For external image URLs, just push the URL to the contentImageUrls array
      contentImageUrls.push(src);
    }
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        content: updatedContent,
        published: published === "true",
        tags: {
          create: parsedTags.map((tag: { id: number; name: string }) => ({
            tag: {
              connectOrCreate: {
                where: { id: tag.id },
                create: { name: tag.name },
              },
            },
            assignedAt: new Date(),
            assignedBy: "system",
          })),
        },
        mainImageUrl,
        mainImageName,
        contentImageUrls,
        length,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return res.status(201).json({
      status: "success",
      message: "Post successfully created",
      post: newPost,
    });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create post",
      error: error.message,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Ensure the ID is an integer and handle cases where the ID is invalid
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return res.status(400).json({
      status: "Failed",
      message: "Invalid post ID",
    });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        status: "Failed",
        message: "Post not found",
      });
    }

    return res.status(200).json({
      status: "success",
      post,
    });
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title,description, content, tags,length, assignedBy = "system" } = req.body;
  const published = req.body.published === "true";
  const file = req.file;

  console.log("Received update request for post:", id);
  console.log("Request body:", req.body);
  console.log("Uploaded file:", file);

  try {
    // First, fetch the current post to get the old image URL
    const currentPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      select: {
        mainImageUrl: true,
        mainImageName: true,
        contentImageUrls: true,
      },
    });

    const updateData: any = {
      title,
      description,
      content,
      published,
      length,
      updatedAt: new Date(),
    };

    if (file) {
      // If there's an old image, delete it
      if (currentPost?.mainImageUrl) {
        await deleteImageFromS3(currentPost.mainImageUrl);
      }

      // Upload new image
      const fileBuffer = file.buffer;
      const { imageUrl, filename } = await uploadToS3(
        fileBuffer,
        file.mimetype,
        false,
        id
      );

      updateData.mainImageUrl = imageUrl;
      updateData.mainImageName = filename;
    } else {
      // If no file is uploaded, keep the existing main image
      updateData.mainImageUrl = currentPost?.mainImageUrl;
      updateData.mainImageName = currentPost?.mainImageName;
    }

    const contentImageRegex = /<img[^>]+src="([^">]+)"/g;
    const newContentImageUrls: string[] = [];
    let updatedContent = content as string;
    let match: RegExpExecArray | null;

    while ((match = contentImageRegex.exec(content)) !== null) {
      const src = match[1];
      if (src.startsWith("data:image")) {
        try {
          const base64Data = src.split(",")[1];
          const buffer = Buffer.from(base64Data, "base64");
          const mimeType = src.split(";")[0].split(":")[1];
          const { imageUrl } = await uploadToS3(buffer, mimeType, false, id);
          newContentImageUrls.push(imageUrl);
          updatedContent = `${updatedContent.slice(
            0,
            match.index
          )}<img src="${imageUrl}"${updatedContent.slice(
            match.index + match[0].length
          )}`;
        } catch (error) {
          console.error("Failed to upload content image:", error);
        }
      } else {
        newContentImageUrls.push(src);
      }
    }

    // Delete old content images that are not in the new content
    const oldContentImageUrls = currentPost?.contentImageUrls || [];
    const imageUrlsToDelete = oldContentImageUrls.filter(
      (url) => !newContentImageUrls.includes(url)
    );
    await Promise.all(imageUrlsToDelete.map(deleteImageFromS3));

    updateData.contentImageUrls = newContentImageUrls;
    updateData.content = updatedContent;

    // Handle tags update
    if (Array.isArray(tags)) {
      updateData.tags = {
        deleteMany: {},
        create: tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
          assignedAt: new Date(),
          assignedBy,
        })),
      };
    }
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log("Updated post:", updatedPost);

    return res.status(200).json({
      status: "success",
      message: "Post successfully updated",
      post: updatedPost,
    });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update post",
      error: error.message,
    });
  }
};

async function deleteImageFromS3(imageUrl: string) {
  try {
    // Extract the image key from the URL
    const urlParts = imageUrl.split("/");
    const imageKey = urlParts.slice(3).join("/");

    const deleteCommand = new DeleteObjectCommand({
      Bucket: awsS3BucketName,
      Key: imageKey,
    });
    await s3.send(deleteCommand);
    console.log(`Deleted image: ${imageKey}`);
  } catch (error: any) {
    console.error("Error deleting image from S3:", error);
  }
}
const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // First, fetch the post to get the mainImageUrl
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      select: { mainImageUrl: true },
    });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    // If there's a mainImageUrl, delete the image from S3
    if (post.mainImageUrl) {
      const imageKey = post.mainImageUrl.split(
        `https://${awsS3BucketName}.s3.${awsS3Region}.amazonaws.com/`
      )[1];

      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: awsS3BucketName,
          Key: imageKey,
        });
        await s3.send(deleteCommand);
        console.log(`Deleted image: ${imageKey}`);
      } catch (error) {
        console.error("Error deleting image from S3:", error);
        // Decide how you want to handle S3 deletion errors
      }
    }

    // Delete the post (this will also delete associated TagsOnPosts due to cascading delete)
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      status: "success",
      message: "Post and associated tags deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete post",
      error: error.message,
    });
  }
};
const getPostsByTag = async (req: Request, res: Response) => {
  const { tagId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            tagId: parseInt(tagId),
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      posts,
    });
  } catch (error: any) {
    console.error("Error fetching posts by tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch posts by tag",
      error: error.message,
    });
  }
};

const getRecentPosts = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 5; // Default to 5 posts

  try {
    const recentPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      posts: recentPosts,
    });
  } catch (error: any) {
    console.error("Error fetching recent posts:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch recent posts",
      error: error.message,
    });
  }
};

const searchPosts = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Search query is required",
    });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { content: { contains: query as string, mode: "insensitive" } },
        ],
        published: true,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      posts,
    });
  } catch (error: any) {
    console.error("Error searching posts:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to search posts",
      error: error.message,
    });
  }
};

const getPostCount = async (req: Request, res: Response) => {
  try {
    const count = await prisma.post.count({
      where: { published: true },
    });

    return res.status(200).json({
      status: "success",
      count,
    });
  } catch (error: any) {
    console.error("Error getting post count:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get post count",
      error: error.message,
    });
  }
};

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByTag,
  getPostCount,
  getRecentPosts,
  searchPosts,
  getLatestPosts
};
