import prisma from "../../prisma/prisma";
import { Request, Response } from "express";

const searchPosts = async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;

    if (typeof query !== "string") {
      throw new Error("Invalid query");
    }

    const posts = await prisma.post.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    return res.status(200).json({
      status: "success",
      posts: posts,
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

export { searchPosts };
