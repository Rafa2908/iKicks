import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized, Login again.",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = token_decode;
    next();
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

export default authMiddleware;
