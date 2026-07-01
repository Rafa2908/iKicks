import jwt from "jsonwebtoken";
import "dotenv/config";
import { client } from "../utils/redisClient";

const authMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      return next();
    } catch {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Login again." });
    }
  }

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, Login again.",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const storedToken = await client.get(`refresh:${decoded.userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Login again." });
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    req.user = decoded;
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, Login again." });
  }
};

export default authMiddleware;