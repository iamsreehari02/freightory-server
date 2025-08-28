import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export async function uploadPDFToCloudinary(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "invoices",
      use_filename: true,
      unique_filename: false,
      type: "private", // ✅ Keep private on Cloudinary
    });

    console.log("✅ PDF uploaded to Cloudinary privately");
    console.log("✅ Public ID:", result.public_id);

    fs.unlinkSync(filePath);

    // ✅ Return public_id instead of URL
    return {
      public_id: result.public_id,
      format: result.format || "pdf",
    };
  } catch (error) {
    console.error("❌ Failed to upload PDF:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }
}
