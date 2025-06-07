const successResponse = (res, statusCode, message, data = null, pagination = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    ...(pagination && { pagination })
  };
  
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  
  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };