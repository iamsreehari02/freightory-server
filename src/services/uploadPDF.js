import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPDFBufferToCloudinary(pdfBuffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // ✅ Handles PDF as a viewable file
        folder: "invoices",
        public_id: filename,
        format: "pdf",
        type: "upload",
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          public_id: result.public_id,
          format: result.format,
          secure_url: result.secure_url, // ✅ Directly usable in browser
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(pdfBuffer);
  });
}
