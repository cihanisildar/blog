import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

export const awsS3Region = process.env.AWS_S3_REGION;
const awsS3AccessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const awsS3SecretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
export const awsS3BucketName = process.env.AWS_S3_BUCKET_NAME;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: awsS3AccessKeyId!,
    secretAccessKey: awsS3SecretAccessKey!,
  },
  region: awsS3Region,
});

// Use memory storage for multer
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});
