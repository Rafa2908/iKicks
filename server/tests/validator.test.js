import { describe, it, expect } from "@jest/globals";
import {
  nonEmptyString,
  positiveInt,
  positiveNumber,
  required,
} from "../utils/validator.js";

describe("Validation that checks for positive integer", () => {
  it("Accepts a positve whole number", () => {
    expect(positiveInt(12)).toBeNull();
  });

  it("Rejects zero", () => {
    expect(positiveInt(0)).toBe("must be a positive whole number");
  });

  it("Rejects empty data on required fields", () => {
    expect(required(null)).toBe("is required");
  });

  it("Accepts data to required fields", () => {
    expect(required(12)).toBeNull();
  });

  it("Rejects nonpositive numbers", () => {
    expect(positiveNumber("12")).toBe("must be a positive number");
  });

  it("Accepts positive numbers", () => {
    expect(positiveNumber(11.5)).toBeNull();
  });

  it("Rejects non-string data", () => {
    expect(nonEmptyString(12)).toBe("must be a non-empty string");
  });

  it("Accepts string data", () => {
    expect(nonEmptyString("hello")).toBeNull();
  });
});
