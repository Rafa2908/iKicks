import axios from "axios";

const userInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/user",
  withCredentials: true,
});

export const registerUser = async (userData) => {
  try {
    const res = await userInstance.post("/register", userData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await userInstance.post("/login", userData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    const res = await userInstance.post("/logout");

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getMe = async () => {
  try {
    const res = await userInstance.get("/me");

    return res.data;
  } catch (error) {
    // 401 is expected when the user is not logged in — don't log it
    if (error?.response?.status !== 401) {
      console.error(error.message);
    }
    return null;
  }
};

export const updateUserInfo = async (userData) => {
  try {
    const res = await userInstance.put("/profile", userData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const activateUserAccount = async () => {
  try {
    const res = await userInstance.put("/activate");

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const deactivateUserAccount = async () => {
  try {
    const res = await userInstance.put("/deactivate");

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const generateCode = async (email) => {
  try {
    const res = await userInstance.post("/auth/get-code", { email });

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const verifyCode = async (userData) => {
  try {
    const res = await userInstance.post("/auth/verify-code", userData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const resetPassword = async (passwordData) => {
  try {
    const res = await userInstance.post("/auth/reset", passwordData);

    return res.data;
  } catch (error) {
    console.error(error.message);
  }
};
