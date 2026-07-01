import axios from "axios";

const shippingInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api/shipping",
  withCredentials: true,
});

export const getAddresses = async () => {
  try {
    const res = await shippingInstance.get("/addresses");
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404) return [];
    console.error(error.message);
    return [];
  }
};

export const addShippingAddress = async (data) => {
  try {
    const res = await shippingInstance.post("/add", data);
    return res.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export const deleteAddress = async (shippingId) => {
  try {
    const res = await shippingInstance.delete("/delete", {
      data: { shippingId },
    });
    return res.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
