import Wishlist from "../models/wishlist.models.js";

export const addSneakerToWishlist = async (req, res) => {
  const { userId, sneakerId } = req.body;

  if (!sneakerId) {
    return res.status(400).json({ message: "Invalid sneaker ID" });
  }

  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        sneakers: [sneakerId],
      });
    } else {
      // Check if the sneaker is already in the wishlist
      if (!wishlist.sneakers.includes(sneakerId)) {
        wishlist.sneakers.push(sneakerId);
        await wishlist.save();
      } else {
        return res
          .status(400)
          .json({ message: "Sneaker is already in your wishlist" });
      }
    }

    res.status(201).json(wishlist);
  } catch (error) {
    console.error("Error in addSneakerToWishlist:", error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteSneakerFromWishlist = async (req, res) => {
  const { userId, sneakerId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      const initialLength = wishlist.sneakers.length;

      wishlist.sneakers = wishlist.sneakers.filter(
        (sneaker) => sneaker.toString() !== sneakerId
      );
      await wishlist.save();

      if (wishlist.sneakers.length === initialLength) {
        console.log("Sneaker was already removed or not found in the wishlist");
      }

      res.status(200).json(wishlist);
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
