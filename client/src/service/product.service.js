import axios from "axios";

const productInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/product",
  withCredentials: true,
});

export const addNewProduct = async (productData) => {
  try {
    const res = await productInstance.post("/add", productData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getProductsPreview = async () => {
  try {
    const res = await productInstance.get("/preview");

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getProductDetails = async (productId) => {
  try {
    const res = await productInstance.get(`/details/${productId}`);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getProductInfo = async () => {
  try {
    const res = await productInstance.get("/info");

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const filterProducts = async (filters) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, v]) => v !== "" && v !== null && v !== undefined,
      ),
    );

    const res = await productInstance.get("/filter", { params: cleanFilters });
    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

//Admin
export const updateQuantityBySize = async (productData) => {
  try {
    const res = await productInstance.put("/update/quantity", productData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const updatePriceById = async (productData) => {
  try {
    const res = await productInstance.put("/update/price", productData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};
