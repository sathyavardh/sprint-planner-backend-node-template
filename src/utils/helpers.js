const mongoose = require('mongoose');

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const sanitizeObject = (obj, fieldsToRemove = []) => {
  const sanitized = { ...obj };
  fieldsToRemove.forEach(field => {
    delete sanitized[field];
  });
  return sanitized;
};

const getPaginationInfo = (page, limit, total) => {
  return {
    current: page,
    pages: Math.ceil(total / limit),
    total,
    limit,
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };
};

module.exports = {
  isValidObjectId,
  generateRandomString,
  sanitizeObject,
  getPaginationInfo
};