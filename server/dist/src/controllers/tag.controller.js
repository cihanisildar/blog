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
exports.updateTag = exports.getTagsForPost = exports.deleteTag = exports.getTagById = exports.getAllTags = exports.createTag = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const getAllTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTags = yield prisma_1.default.tag.findMany({
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
    }
    catch (error) {
        console.error("Error fetching allTags:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch allTags",
            error: error.message,
        });
    }
});
exports.getAllTags = getAllTags;
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    try {
        const newTag = yield prisma_1.default.tag.create({
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
    }
    catch (error) {
        console.error("Error creating tag:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to create tag",
            error: error.message,
        });
    }
});
exports.createTag = createTag;
const getTagById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tag = yield prisma_1.default.tag.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching tag:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch tag",
            error: error.message,
        });
    }
});
exports.getTagById = getTagById;
const updateTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedTag = yield prisma_1.default.tag.update({
            where: { id: parseInt(id) },
            data: { name, description },
        });
        return res.status(200).json({
            status: "success",
            message: "Tag successfully updated",
            tag: updatedTag,
        });
    }
    catch (error) {
        console.error("Error updating tag:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to update tag",
            error: error.message,
        });
    }
});
exports.updateTag = updateTag;
const deleteTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.tag.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({
            status: "success",
            message: "Tag successfully deleted",
        });
    }
    catch (error) {
        console.error("Error deleting tag:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to delete tag",
            error: error.message,
        });
    }
});
exports.deleteTag = deleteTag;
const getTagsForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const tags = yield prisma_1.default.tagsOnPosts.findMany({
            where: { postId: parseInt(postId) },
            include: { tag: true },
        });
        return res.status(200).json({
            status: "success",
            tags: tags.map((t) => t.tag),
        });
    }
    catch (error) {
        console.error("Error fetching tags for post:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch tags for post",
            error: error.message,
        });
    }
});
exports.getTagsForPost = getTagsForPost;
