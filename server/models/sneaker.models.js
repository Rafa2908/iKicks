import { Schema, model } from "mongoose";

const SneakerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Must enter a name"],
      maxLength: [50],
    },
    description: {
      type: String,
      required: [true, "Must enter a description"],
      maxLength: [500, "Description is too long."],
    },
    price: {
      type: Number,
      required: [true],
      minLength: [1],
    },
    brand: {
      type: String,
      required: [true],
      minLength: [2],
    },
    image: {
      image1: {
        type: String,
        required: [true, "Enter product image 1."],
      },
      image2: {
        type: String,
        required: [true, "Enter product image 2."],
      },
      image3: {
        type: String,
        required: [true, "Enter product image 3."],
      },
      image4: {
        type: String,
        required: [true, "Enter product image 4."],
      },
    },
  },
  { timestamps: true }
);

const Sneaker = model("Sneaker", SneakerSchema);

export default Sneaker;
