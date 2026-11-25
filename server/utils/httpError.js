export class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
    this.details = details;
  }
}
