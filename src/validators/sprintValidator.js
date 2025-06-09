const Joi = require('joi');

const sprintSchema = Joi.object({
  sprintStartDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Sprint start date must be a valid date',
      'any.required': 'Sprint start date is required'
    }),

  sprintEndDate: Joi.date()
    .required()
    .greater(Joi.ref('sprintStartDate'))
    .messages({
      'date.base': 'Sprint end date must be a valid date',
      'date.greater': 'Sprint end date must be after the start date',
      'any.required': 'Sprint end date is required'
    }),

  allTaskIds: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
          'string.pattern.base': 'Each task ID must be a valid MongoDB ObjectId'
        })
    )
    .unique()
    .optional()
    .messages({
      'array.base': 'allTaskIds must be an array',
      'array.unique': 'Duplicate task IDs are not allowed'
    })
});

const validateSprint = (req, res, next) => {
  const { error, value } = sprintSchema.validate(req.body, {
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
  validateSprint,
  sprintSchema
};