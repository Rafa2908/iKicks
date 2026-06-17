import axios from "axios";

const orderInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/order",
  withCredentials: true,
});

export const placeOrder = async (orderData) => {
  try {
    const res = await orderInstance.post("/place", orderData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getOrdersPreview = async () => {
  try {
    const res = await orderInstance.get("/preview");
    return res.data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const getOrderDetails = async (shippingId) => {
  try {
    const res = await orderInstance.get(`/details/${shippingId}`);
    return res.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
