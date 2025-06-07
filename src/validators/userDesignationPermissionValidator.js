const Joi = require('joi');

const validateUserDesignationPermission = (req, res, next) => {
  const schema = Joi.object({
    userDesignationId: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: error.details.map(detail => detail.message) 
    });
  }
  next();
};

module.exports = { validateUserDesignationPermission };