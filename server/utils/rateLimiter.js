import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many attempts. Please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generateCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many requests. Try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const codeVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  skipSuccessfulRequests: true,
  message: { message: "Too many attempts. Please request a new code" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many attempts. Please request a new code" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const getDataLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => `${req.user?.userId}:${req.path}`,
  message: { message: "Too many requests. Try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
