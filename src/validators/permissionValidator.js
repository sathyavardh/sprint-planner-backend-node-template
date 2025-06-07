const Joi = require('joi');

const validatePermission = (req, res, next) => {
  const schema = Joi.object({
    permissionName: Joi.string().required(),
    permissionDescription: Joi.string().required()
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

module.exports = { validatePermission };