import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import os from "os";
import type { FileHandler } from "../utils/interface";
import path from "path";

class CloudinaryService implements FileHandler {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async uploadFile(
    file: any,
    folder: string,
    filename: string
  ): Promise<string | null> {
    try {
      if (!file) throw new Error("No file provided");

      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, file.originalname);

      const buffer = Buffer.from(await file.buffer);
      await fs.writeFile(tempFilePath, buffer);

      const mimeType = file.mimetype;

      console.log(mimeType);
      // Upload the file to Cloudinary
      const response = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: "auto",
        // flags: "attachment",
        folder: folder,
        public_id: filename,
        access_mode: "public",
      });

      await fs.unlink(tempFilePath);

      return response.secure_url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteFile(fileUrl: string): Promise<string | null> {
    try {
      if (!fileUrl) throw new Error("No URL provided");

      const publicId = this.extractFileId(fileUrl);
      if (!publicId) throw new Error("Invalid Cloudinary URL");

      const response = await cloudinary.uploader.destroy(publicId);

      if (response.result !== "ok") throw new Error("error in deleting file");

      return "File deleted successfully";
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  extractFileId(fileUrl: string): string {
    try {
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      return pathname
        .split("/")
        .slice(2)
        .join("/")
        .replace(/\.[^/.]+$/, "");
    } catch (error) {
      console.error("Invalid Cloudinary URL:", fileUrl);
      return "";
    }
  }
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
