import User from "../models/user.models.js";

export const addToCart = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.body.userId });
    let cartData = userData.cartData || new Map();

    if (!cartData.has(req.body.itemId)) {
      cartData.set(req.body.itemId, 1);
    } else {
      cartData.set(req.body.itemId, cartData.get(req.body.itemId) + 1);
    }

    await User.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
    res
      .status(201)
      .json({ success: true, message: "Product has been added to the cart." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: `${error}` });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.body.userId });
    let cartData = userData.cartData || new Map();

    if (cartData.has(req.body.itemId)) {
      if (cartData.get(req.body.itemId) > 1) {
        cartData.set(req.body.itemId, cartData.get(req.body.itemId) - 1);
      } else {
        cartData.delete(req.body.itemId);
      }
    }

    await User.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
    res.status(200).json({
      success: true,
      message: "Product has been removed from the cart.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: `${error}` });
  }
};

export const getCart = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.body.userId });
    let cartData = userData.cartData || new Map();
    res
      .status(200)
      .json({ success: true, cartData: Object.fromEntries(cartData) });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: `${error}` });
  }
};
