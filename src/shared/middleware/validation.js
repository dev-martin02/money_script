import { AppError } from "../../utils/errors/errors.js";

/**
 * Validates request body against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export function validateBody(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const details = error.errors.reduce((acc, err) => {
          const field = err.path.join(".");
          acc[field] = err.message;
          return acc;
        }, {});

        throw AppError.validation("Validation failed", details);
      }
      throw error;
    }
  };
}

/**
 * Validates query parameters against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const details = error.errors.reduce((acc, err) => {
          const field = err.path.join(".");
          acc[field] = err.message;
          return acc;
        }, {});

        throw AppError.validation("Query validation failed", details);
      }
      throw error;
    }
  };
}

/**
 * Validates URL parameters against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export function validateParams(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const details = error.errors.reduce((acc, err) => {
          const field = err.path.join(".");
          acc[field] = err.message;
          return acc;
        }, {});

        throw AppError.validation("Parameter validation failed", details);
      }
      throw error;
    }
  };
}

/**
 * Validates multiple parts of the request
 * @param {Object} schemas - Object with body, query, and/or params schemas
 * @returns {Function} Express middleware function
 */
export function validate({ body, query, params }) {
  return (req, res, next) => {
    try {
      const errors = {};

      if (body) {
        try {
          req.body = body.parse(req.body);
        } catch (error) {
          if (error.name === "ZodError") {
            error.errors.forEach((err) => {
              const field = `body.${err.path.join(".")}`;
              errors[field] = err.message;
            });
          }
        }
      }

      if (query) {
        try {
          req.query = query.parse(req.query);
        } catch (error) {
          if (error.name === "ZodError") {
            error.errors.forEach((err) => {
              const field = `query.${err.path.join(".")}`;
              errors[field] = err.message;
            });
          }
        }
      }

      if (params) {
        try {
          req.params = params.parse(req.params);
        } catch (error) {
          if (error.name === "ZodError") {
            error.errors.forEach((err) => {
              const field = `params.${err.path.join(".")}`;
              errors[field] = err.message;
            });
          }
        }
      }

      if (Object.keys(errors).length > 0) {
        throw AppError.validation("Validation failed", errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
