import axios from "axios";

const paymentInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api/payment",
  withCredentials: true,
});

export const makePayment = async (orderId) => {
  try {
    const res = await paymentInstance.post("/process", { orderId });
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const cashPayment = async ({ orderId }) => {
  try {
    const res = await paymentInstance.post("/cash", orderId);

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const bankTransferPayment = async ({ orderId }) => {
  try {
    const res = await paymentInstance.post("/bank", orderId);

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const updatePayment = async (orderData) => {
  try {
    const res = await paymentInstance.post("/method/update", orderData);

    return res.data;
  } catch (error) {
    console.error(error);
  }
};
