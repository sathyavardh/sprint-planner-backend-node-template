const Joi = require("joi");

const commentSchema = Joi.object({
  taskId: Joi.string().required(),
  userId: Joi.string().required(),
  comment: Joi.string().required().min(1)
});

const validateTaskComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateTaskComment };