import jwt from "jsonwebtoken";

export const authManager = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      success: false,
      message: "Access denied. Not authorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.json({
        success: false,
        message: "Not authorized. Admin only",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};
