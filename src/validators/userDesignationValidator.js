const Joi = require('joi');

const userDesignationSchema = Joi.object({
  designationName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.base': 'Designation name must be a string',
      'string.empty': 'Designation name is required',
      'string.min': 'Designation name must be at least 2 characters long',
      'string.max': 'Designation name must not exceed 100 characters',
      'any.required': 'Designation name is required'
    }),

  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .trim()
    .messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description must not exceed 500 characters'
    }),

  permissions: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
          'string.pattern.base': 'Each permission must be a valid MongoDB ObjectId'
        })
    )
    .unique()
    .optional()
    .messages({
      'array.base': 'Permissions must be an array',
      'array.unique': 'Duplicate permission IDs are not allowed'
    })
});

const validateUserDesignation = (req, res, next) => {
  const { error, value } = userDesignationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));

    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateUserDesignation,
  userDesignationSchema
};