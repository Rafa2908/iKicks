import axios from "axios";

const cartInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api/cart",
  withCredentials: true,
});

export const addToCart = async (cartData) => {
  try {
    const res = await cartInstance.post("/add", cartData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const cartTotal = async () => {
  try {
    const res = await cartInstance.get("/count");

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const increaseQuantityInCart = async (cartData) => {
  try {
    const res = await cartInstance.put("/increase", cartData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const decreaseQuantityInCart = async (cartData) => {
  try {
    const res = await cartInstance.put("/decrease", cartData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getCartItemsPreview = async () => {
  try {
    const res = await cartInstance.get("/preview");

    return res.data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const deleteCartItem = async ({ sizeId }) => {
  try {
    const res = await cartInstance.delete("/delete", { data: { sizeId } });

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const clearCart = async () => {
  try {
    await cartInstance.delete("/clear");
  } catch (error) {
    console.error(error.message);
  }
};
