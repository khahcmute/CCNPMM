const Joi = require("joi");

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};

// Common validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const productSearchSchema = Joi.object({
  q: Joi.string().min(1).max(100),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  categoryId: Joi.number().integer().min(1),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  sortBy: Joi.string().valid(
    "newest",
    "price_asc",
    "price_desc",
    "rating",
    "views",
    "name"
  ),
  onSale: Joi.boolean(),
  featured: Joi.boolean(),
  inStock: Joi.boolean(),
  minRating: Joi.number().min(0).max(5),
});

module.exports = {
  validateRequest,
  validateQuery,
  paginationSchema,
  productSearchSchema,
};
