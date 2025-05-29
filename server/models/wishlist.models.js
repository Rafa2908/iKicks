import { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  sneakers: [
    {
      type: Schema.Types.ObjectId,
      ref: "sneaker",
    },
  ],
});

const Wishlist = model("wishlist", wishlistSchema);

export default Wishlist;
