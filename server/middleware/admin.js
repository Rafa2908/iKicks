import jwt from "jsonwebtoken";

export const authManager = async (req, res, next) => {
  const { role } = req?.user;

  try {
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized. Admin only",
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Bad request" });
  }
};
