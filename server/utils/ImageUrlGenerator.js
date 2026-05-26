import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateUrl = async (images) => {
  const imageUrl = [];

  for (const image of images) {
    const url = await cloudinary.uploader.upload(image, {
      folder: "ikicks/products",
    });

    imageUrl.push(url.secure_url);
  }

  return imageUrl;
};
