const Joi = require('joi');
const { TASK_TAGS, TASK_LEVELS, TASK_STATUS } = require('../config/constants');

const taskSchema = Joi.object({
  userId: Joi.string().required(),
  taskName: Joi.string().required(),
  taskDescription: Joi.string().allow(''),
  taskTags: Joi.array().items(Joi.string().valid(...TASK_TAGS)).optional(),
  taskLevel: Joi.string().valid(...TASK_LEVELS).optional(),
  taskStatus: Joi.string().valid(...TASK_STATUS).optional(),
  taskStartDate: Joi.date().optional(),
  taskEndDate: Joi.date().optional(),
  assign: Joi.array().items(
    Joi.object({
      userId: Joi.string().required()
    })
  ).optional()
});

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateTask };
