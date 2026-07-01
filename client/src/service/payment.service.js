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
