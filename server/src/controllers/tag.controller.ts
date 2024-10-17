import { Request, Response } from "express";
import { Tag } from "../models/tag.model";
import prisma from "../../prisma/prisma";

const getAllTags = async (req: Request, res: Response) => {
  try {
    const allTags = await prisma.tag.findMany({
      include: {
        posts: true,
      },
    });

    if (!allTags || allTags.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No tags found",
      });
    }

    return res.status(200).json({
      status: "success",
      tags: allTags,
    });
  } catch (error: any) {
    console.error("Error fetching allTags:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch allTags",
      error: error.message,
    });
  }
};

const createTag = async (req: Request, res: Response) => {
  const { name, description } = req.body as Tag;

  try {
    const newTag = await prisma.tag.create({
      data: {
        name,
        description
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Tag successfully created",
      tag: newTag,
    });
  } catch (error: any) {
    console.error("Error creating tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create tag",
      error: error.message,
    });
  }
};
const getTagById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        posts: {
          include: {
            post: true
          }
        }
      },
    });

    if (!tag) {
      return res.status(404).json({
        status: "Failed",
        message: "Tag not found",
      });
    }

    return res.status(200).json({
      status: "success",
      tag,
    });
  } catch (error: any) {
    console.error("Error fetching tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch tag",
      error: error.message,
    });
  }
};

const updateTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body as Tag;

  try {
    const updatedTag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    return res.status(200).json({
      status: "success",
      message: "Tag successfully updated",
      tag: updatedTag,
    });
  } catch (error: any) {
    console.error("Error updating tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update tag",
      error: error.message,
    });
  }
};

const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      status: "success",
      message: "Tag successfully deleted",
    });
  } catch (error: any) {
    console.error("Error deleting tag:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete tag",
      error: error.message,
    });
  }
};
const getTagsForPost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const tags = await prisma.tagsOnPosts.findMany({
      where: { postId: parseInt(postId) },
      include: { tag: true },
    });

    return res.status(200).json({
      status: "success",
      tags: tags.map((t) => t.tag),
    });
  } catch (error: any) {
    console.error("Error fetching tags for post:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch tags for post",
      error: error.message,
    });
  }
};

export {
  createTag,
  getAllTags,
  getTagById,
  deleteTag,
  getTagsForPost,
  updateTag,
};
