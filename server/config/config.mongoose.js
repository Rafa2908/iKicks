import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

export const dbConnect = async () => {
  try {
    connect(MONGODB_URI, { dbName: "sneaker_inventory" });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`DB not connected... ${error}`);
  }
};
