const Joi = require('joi');

const validateUser = (req, res, next) => {
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

const validateUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50),
    userEmail: Joi.string().email(),
    userDesignation: Joi.string(),
    userCompany: Joi.string(),
    userPassword: Joi.string().min(6),
    userPhno: Joi.string()
  }).min(1);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: error.details.map(detail => detail.message) 
    });
  }
  next();
};

module.exports = { validateUser, validateUserUpdate };