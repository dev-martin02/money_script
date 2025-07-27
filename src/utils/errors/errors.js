export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distinguishes operational errors from programming errors

    Error.captureStackTrace(this, this.constructor);
  }

  // Static methods for common error types
  static badRequest(message = "Bad request", details = null) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, 404);
  }

  static conflict(message = "Conflict") {
    return new AppError(message, 409);
  }

  static validation(message = "Validation failed", details = null) {
    return new AppError(message, 422, details);
  }

  static internal(message = "Internal server error") {
    return new AppError(message, 500);
  }

  static database(message = "Database error", originalError = null) {
    const details = originalError
      ? { originalError: originalError.message }
      : null;
    return new AppError(message, 500, details);
  }
}

// For backwards compatibility (temporarily)
export const DatabaseError = AppError;
export const UserError = AppError;
export const ApiError = AppError;
export const NotFoundError = AppError;
export const BadRequestError = AppError;
