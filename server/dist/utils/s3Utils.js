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
exports.uploadToS3 = uploadToS3;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Config_1 = require("../config/s3Config");
const crypto_1 = __importDefault(require("crypto"));
function uploadToS3(buffer, mimetype, isMainImage, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const randomImageName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
        let filename;
        if (isMainImage) {
            filename = `main-images/${randomImageName()}`;
        }
        else if (postId) {
            filename = `edited-images/${postId}/${randomImageName()}`;
        }
        else {
            filename = `content-images/${randomImageName()}`;
        }
        const params = {
            Bucket: s3Config_1.awsS3BucketName,
            Key: filename,
            Body: buffer,
            ContentType: mimetype,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            yield s3Config_1.s3.send(command);
            const imageUrl = `https://${s3Config_1.awsS3BucketName}.s3.${s3Config_1.awsS3Region}.amazonaws.com/${filename}`;
            return { imageUrl, filename };
        }
        catch (error) {
            console.error("Error uploading to S3:", error);
            throw error;
        }
    });
}
