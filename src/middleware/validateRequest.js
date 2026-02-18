import { ZodError } from "zod";

export const validateRequest = (schema) => {
  return function (req, res, next) {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body) {
        req.body = parsed.body;
      }
      // if (parsed.query) {
      //   req.query = { ...req.query, ...parsed.query };
      // }
      if (parsed.params) {
        req.params = parsed.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: JSON.parse(error.message).map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
