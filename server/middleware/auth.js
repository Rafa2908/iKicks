import jwt from "jsonwebtoken";
import "dotenv/config";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized, Login again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

export default authMiddleware;
