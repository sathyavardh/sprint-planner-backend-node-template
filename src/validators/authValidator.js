const Joi = require('joi');

const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    userEmail: Joi.string().email().required(),
    userDesignation: Joi.string().required(),
    userCompany: Joi.string().required(),
    userPassword: Joi.string().min(6).required(),
    userPhno: Joi.string().required()
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

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    userEmail: Joi.string().email().required(),
    userPassword: Joi.string().required()
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

module.exports = { validateSignup, validateLogin };