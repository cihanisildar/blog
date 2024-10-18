"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const post_router_1 = __importDefault(require("./routes/post.router"));
const tag_router_1 = __importDefault(require("./routes/tag.router"));
const search_router_1 = __importDefault(require("./routes/search.router"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use("/post", post_router_1.default);
app.use("/tag", tag_router_1.default);
app.use("/search", search_router_1.default);
app.listen(PORT, () => {
    console.log(`Server has started at port ${PORT}`);
});
