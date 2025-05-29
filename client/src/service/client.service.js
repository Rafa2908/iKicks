import axios from "axios";

const sneaker_instance = axios.create({
  baseURL: "http://localhost:8004/sneaker",
});

const USER_INSTANCE = axios.create({
  baseURL: "http://localhost:8004/user",
});

const CART_INSTANCE = axios.create({
  baseURL: "http://localhost:8004/cart",
});

const payment_instance = axios.create({
  baseURL: "http://localhost:8004/order",
  headers: {
    "Content-Type": "application/json",
  },
});

const wishlist_instance = axios.create({
  baseURL: "http://localhost:8004/wishlist",
});

// User Instance

export const registerUser = async (userData) => {
  try {
    const res = await USER_INSTANCE.post("/register", userData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
0;
export const loginUser = async (userData) => {
  try {
    const res = await USER_INSTANCE.post("/login", userData);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (token) => {
  try {
    const res = await USER_INSTANCE.get("/profile", {
      headers: {
        token: `${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

//Cart Instance

export const addSneakerToCart = async (token, itemId) => {
  try {
    const res = await CART_INSTANCE.post(
      "/add",
      { itemId },
      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSneakerFromCart = async (token, itemId) => {
  try {
    const res = await CART_INSTANCE.post(
      "/remove",
      { itemId },
      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCart = async (token) => {
  try {
    const res = await CART_INSTANCE.get("/get", {
      headers: {
        token: `${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

//Sneaker Instance

export const createSneaker = async (sneakerData) => {
  try {
    const res = await sneaker_instance.post("/", sneakerData);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const getAllSneakers = async () => {
  try {
    const res = await sneaker_instance.get("/");
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const getSneakerById = async (id) => {
  try {
    const res = await sneaker_instance.get(`/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const updateSneakerById = async (data) => {
  try {
    const res = await sneaker_instance.put(`/${data._id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const deleteSneakerById = async (id) => {
  try {
    const res = await sneaker_instance.delete(`/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSneakerByBrand = async (brandData) => {
  try {
    const res = await sneaker_instance.get(`/brand/${brandData}`, {
      brandData,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

//Payment instance

export const stripePayment = async (paymentData, token) => {
  try {
    const res = await payment_instance.post("/place", paymentData, {
      headers: {
        token: `${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOrder = async (data, token) => {
  try {
    const res = await payment_instance.post("/verify", data, {
      headers: {
        token: `${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const userOrders = async (token) => {
  try {
    const res = await payment_instance.get("/userorders", {
      headers: {
        token: `${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

//Wishlist instance

export const addSneakerToWishlist = async (token, sneakerId) => {
  try {
    const res = await wishlist_instance.post(
      "/",
      { sneakerId },
      {
        headers: {
          token: `${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
