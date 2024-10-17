import express from "express";
import { createTag, getAllTags, getTagById } from "../controllers/tag.controller";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:id", getTagById);
router.post("/create", createTag);

export default router;
