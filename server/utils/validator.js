import { HttpError } from "./httpError.js";

export const required = (value) =>
  value === undefined || value === null || value === "" ? "is required" : null;

export const positiveInt = (value) =>
  value < 1 || !Number.isInteger(value)
    ? "must be a positive whole number"
    : null;

export const positiveNumber = (value) =>
  !Number.isFinite(value) || value <= 0 ? "must be a positive number" : null;

export const nonEmptyString = (value) =>
  typeof value !== "string" || value.trim() === ""
    ? "must be a non-empty string"
    : null;

export const validate = (rules) => (req, res, next) => {
  const body = req.body ?? {};
  const errors = [];
  const clean = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = body[field];

    let message = null;

    for (const rule of fieldRules) {
      message = rule(value);
      if (message) break;
    }

    if (message) {
      errors.push({ field, message: `${field} ${message}` });
    } else {
      clean[field] = value;
    }
  }

  if (errors.length > 0) {
    throw new HttpError(400, "Validation failed", errors);
  }

  req.body = clean;
  next();
};
