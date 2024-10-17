import express from "express";
import { searchPosts } from "../controllers/search.controller";

const router = express.Router();

router.get("", searchPosts);

export default router;
