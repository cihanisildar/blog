import cors from "cors";
import express from "express";
import postRouter from "./routes/post.router";
import searchRouter from "./routes/search.router";
import tagRouter from "./routes/tag.router";


const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL1,
  process.env.FRONTEND_URL2,
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/post", postRouter);
app.use("/tag", tagRouter);
app.use("/search", searchRouter);

export default app;

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server has started at port ${PORT}`);
  });
}