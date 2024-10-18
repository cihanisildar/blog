"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.s3 = exports.awsS3BucketName = exports.awsS3Region = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.awsS3Region = process.env.AWS_S3_REGION;
const awsS3AccessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const awsS3SecretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
exports.awsS3BucketName = process.env.AWS_S3_BUCKET_NAME;
exports.s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: awsS3AccessKeyId,
        secretAccessKey: awsS3SecretAccessKey,
    },
    region: exports.awsS3Region,
});
// Use memory storage for multer
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});
