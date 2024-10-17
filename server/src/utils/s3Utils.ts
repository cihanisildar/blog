import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, awsS3BucketName, awsS3Region } from "../config/s3Config";
import crypto from "crypto";

export async function uploadToS3(buffer: Buffer, mimetype: string, isMainImage: boolean, postId?: string | null) {
  const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");
  let filename: string;

  if (isMainImage) {
    filename = `main-images/${randomImageName()}`;
  } else if (postId) {
    filename = `edited-images/${postId}/${randomImageName()}`;
  } else {
    filename = `content-images/${randomImageName()}`;
  }

  const params = {
    Bucket: awsS3BucketName,
    Key: filename,
    Body: buffer,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    const imageUrl = `https://${awsS3BucketName}.s3.${awsS3Region}.amazonaws.com/${filename}`;

    return { imageUrl, filename };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}