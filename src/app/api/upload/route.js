import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// API Route to Handle Image Uploads
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const file = req.body.file; // The image file (base64 string)
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder: "my-folder", // Optional: Cloudinary folder name
      });
      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      res.status(500).json({ error: "Upload failed", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
