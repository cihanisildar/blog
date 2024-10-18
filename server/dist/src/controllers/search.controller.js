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
exports.searchPosts = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q: query } = req.query;
        if (typeof query !== "string") {
            throw new Error("Invalid query");
        }
        const posts = yield prisma_1.default.post.findMany({
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
exports.searchPosts = searchPosts;
