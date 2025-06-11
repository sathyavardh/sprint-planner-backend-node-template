const Joi = require('joi');

const checklistItemSchema = Joi.object({
  item: Joi.string().trim().required(),
  isCompleted: Joi.boolean().optional()
});

const checklistSchema = Joi.object({
  taskId: Joi.string().required(),
  checklist: Joi.array().items(checklistItemSchema).required()
});

const validateChecklist = (req, res, next) => {
  const { error } = checklistSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateChecklist };
