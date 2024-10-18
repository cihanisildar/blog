"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestPosts = exports.searchPosts = exports.getRecentPosts = exports.getPostCount = exports.getPostsByTag = exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const s3Utils_1 = require("../utils/s3Utils");
const s3Config_1 = require("../config/s3Config");
const client_s3_1 = require("@aws-sdk/client-s3");
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPosts = yield prisma_1.default.post.findMany({
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
    }
    catch (error) {
        console.error("Error fetching allPosts:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch allPosts",
            error: error.message,
        });
    }
});
exports.getAllPosts = getAllPosts;
const getLatestPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Fetching latest posts");
        const latestPosts = yield prisma_1.default.post.findMany({
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
    }
    catch (error) {
        console.error("Error fetching latest posts:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch latest posts",
            error: error.message,
        });
    }
});
exports.getLatestPosts = getLatestPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, content, published, length, tags = [] } = req.body;
    console.log("Body:", req.body);
    console.log("File details:", req.file);
    // Ensure tags is an array
    let parsedTags = [];
    try {
        if (typeof tags === "string") {
            parsedTags = JSON.parse(tags);
            if (!Array.isArray(parsedTags)) {
                throw new Error("Tags must be an array of objects");
            }
        }
        else if (Array.isArray(tags)) {
            parsedTags = tags;
        }
        else {
            throw new Error("Tags must be an array or a JSON string");
        }
    }
    catch (error) {
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
            const { imageUrl, filename } = yield (0, s3Utils_1.uploadToS3)(req.file.buffer, req.file.mimetype, true);
            mainImageUrl = imageUrl;
            mainImageName = filename;
        }
        catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Failed to upload main image",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    // Extract and upload images from content
    const contentImageRegex = /<img[^>]+src="([^">]+)"/g;
    const contentImageUrls = [];
    const contentString = content;
    let match;
    const matches = [];
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
                const { imageUrl } = yield (0, s3Utils_1.uploadToS3)(buffer, mimeType, false, null);
                contentImageUrls.push(imageUrl);
                updatedContent = `${updatedContent.slice(0, start)}<img src="${imageUrl}"${updatedContent.slice(end)}`;
            }
            catch (error) {
                console.error("Failed to upload content image:", error);
            }
        }
        else {
            // For external image URLs, just push the URL to the contentImageUrls array
            contentImageUrls.push(src);
        }
    }
    try {
        const newPost = yield prisma_1.default.post.create({
            data: {
                title,
                description,
                content: updatedContent,
                published: published === "true",
                tags: {
                    create: parsedTags.map((tag) => ({
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
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to create post",
            error: error.message,
        });
    }
});
exports.createPost = createPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const post = yield prisma_1.default.post.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch post",
            error: error.message,
        });
    }
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, content, tags, length, assignedBy = "system" } = req.body;
    const published = req.body.published === "true";
    const file = req.file;
    console.log("Received update request for post:", id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", file);
    try {
        // First, fetch the current post to get the old image URL
        const currentPost = yield prisma_1.default.post.findUnique({
            where: { id: parseInt(id) },
            select: {
                mainImageUrl: true,
                mainImageName: true,
                contentImageUrls: true,
            },
        });
        const updateData = {
            title,
            description,
            content,
            published,
            length,
            updatedAt: new Date(),
        };
        if (file) {
            // If there's an old image, delete it
            if (currentPost === null || currentPost === void 0 ? void 0 : currentPost.mainImageUrl) {
                yield deleteImageFromS3(currentPost.mainImageUrl);
            }
            // Upload new image
            const fileBuffer = file.buffer;
            const { imageUrl, filename } = yield (0, s3Utils_1.uploadToS3)(fileBuffer, file.mimetype, false, id);
            updateData.mainImageUrl = imageUrl;
            updateData.mainImageName = filename;
        }
        else {
            // If no file is uploaded, keep the existing main image
            updateData.mainImageUrl = currentPost === null || currentPost === void 0 ? void 0 : currentPost.mainImageUrl;
            updateData.mainImageName = currentPost === null || currentPost === void 0 ? void 0 : currentPost.mainImageName;
        }
        const contentImageRegex = /<img[^>]+src="([^">]+)"/g;
        const newContentImageUrls = [];
        let updatedContent = content;
        let match;
        while ((match = contentImageRegex.exec(content)) !== null) {
            const src = match[1];
            if (src.startsWith("data:image")) {
                try {
                    const base64Data = src.split(",")[1];
                    const buffer = Buffer.from(base64Data, "base64");
                    const mimeType = src.split(";")[0].split(":")[1];
                    const { imageUrl } = yield (0, s3Utils_1.uploadToS3)(buffer, mimeType, false, id);
                    newContentImageUrls.push(imageUrl);
                    updatedContent = `${updatedContent.slice(0, match.index)}<img src="${imageUrl}"${updatedContent.slice(match.index + match[0].length)}`;
                }
                catch (error) {
                    console.error("Failed to upload content image:", error);
                }
            }
            else {
                newContentImageUrls.push(src);
            }
        }
        // Delete old content images that are not in the new content
        const oldContentImageUrls = (currentPost === null || currentPost === void 0 ? void 0 : currentPost.contentImageUrls) || [];
        const imageUrlsToDelete = oldContentImageUrls.filter((url) => !newContentImageUrls.includes(url));
        yield Promise.all(imageUrlsToDelete.map(deleteImageFromS3));
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
        const updatedPost = yield prisma_1.default.post.update({
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
    }
    catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to update post",
            error: error.message,
        });
    }
});
exports.updatePost = updatePost;
function deleteImageFromS3(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extract the image key from the URL
            const urlParts = imageUrl.split("/");
            const imageKey = urlParts.slice(3).join("/");
            const deleteCommand = new client_s3_1.DeleteObjectCommand({
                Bucket: s3Config_1.awsS3BucketName,
                Key: imageKey,
            });
            yield s3Config_1.s3.send(deleteCommand);
            console.log(`Deleted image: ${imageKey}`);
        }
        catch (error) {
            console.error("Error deleting image from S3:", error);
        }
    });
}
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // First, fetch the post to get the mainImageUrl
        const post = yield prisma_1.default.post.findUnique({
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
            const imageKey = post.mainImageUrl.split(`https://${s3Config_1.awsS3BucketName}.s3.${s3Config_1.awsS3Region}.amazonaws.com/`)[1];
            try {
                const deleteCommand = new client_s3_1.DeleteObjectCommand({
                    Bucket: s3Config_1.awsS3BucketName,
                    Key: imageKey,
                });
                yield s3Config_1.s3.send(deleteCommand);
                console.log(`Deleted image: ${imageKey}`);
            }
            catch (error) {
                console.error("Error deleting image from S3:", error);
                // Decide how you want to handle S3 deletion errors
            }
        }
        // Delete the post (this will also delete associated TagsOnPosts due to cascading delete)
        yield prisma_1.default.post.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({
            status: "success",
            message: "Post and associated tags deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to delete post",
            error: error.message,
        });
    }
});
exports.deletePost = deletePost;
const getPostsByTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tagId } = req.params;
    try {
        const posts = yield prisma_1.default.post.findMany({
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
    }
    catch (error) {
        console.error("Error fetching posts by tag:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch posts by tag",
            error: error.message,
        });
    }
});
exports.getPostsByTag = getPostsByTag;
const getRecentPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 5; // Default to 5 posts
    try {
        const recentPosts = yield prisma_1.default.post.findMany({
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
    }
    catch (error) {
        console.error("Error fetching recent posts:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch recent posts",
            error: error.message,
        });
    }
});
exports.getRecentPosts = getRecentPosts;
const searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({
            status: "error",
            message: "Search query is required",
        });
    }
    try {
        const posts = yield prisma_1.default.post.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { content: { contains: query, mode: "insensitive" } },
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
    }
    catch (error) {
        console.error("Error searching posts:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to search posts",
            error: error.message,
        });
    }
});
exports.searchPosts = searchPosts;
const getPostCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield prisma_1.default.post.count({
            where: { published: true },
        });
        return res.status(200).json({
            status: "success",
            count,
        });
    }
    catch (error) {
        console.error("Error getting post count:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to get post count",
            error: error.message,
        });
    }
});
exports.getPostCount = getPostCount;
