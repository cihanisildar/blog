"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const s3Config_1 = require("../config/s3Config");
const router = express_1.default.Router();
router.get("/latest-posts", post_controller_1.getLatestPosts);
router.get("/", post_controller_1.getAllPosts);
router.get("/:id", post_controller_1.getPostById);
router.post("/create", s3Config_1.upload.single("mainImage"), post_controller_1.createPost);
router.delete("/:id", post_controller_1.deletePost);
router.put("/:id", s3Config_1.upload.single("mainImage"), post_controller_1.updatePost);
exports.default = router;
