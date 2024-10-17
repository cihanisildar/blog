import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getLatestPosts,
  getPostById,
  updatePost,
} from "../controllers/post.controller";
import { upload } from "../config/s3Config";

const router = express.Router();

router.get("/latest-posts", getLatestPosts);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/create", upload.single("mainImage"), createPost);
router.delete("/:id", deletePost);
router.put("/:id", upload.single("mainImage"), updatePost);

export default router;
