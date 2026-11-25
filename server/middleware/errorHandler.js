import { HttpError } from "../utils/httpError.js";

export const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    const body = { message: error.message };
    if (error.details) body.errors = error.details;
    return res.status(error.statusCode).json(body);
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};
