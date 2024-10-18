import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import postRouter from "./routes/post.router";
import tagRouter from "./routes/tag.router";
import searchRouter from "./routes/search.router";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL1!, process.env.FRONTEND_URL2!],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/post", postRouter);
app.use("/tag", tagRouter);
app.use("/search", searchRouter);
app.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
