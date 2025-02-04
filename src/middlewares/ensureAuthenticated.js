import ApiError from './../utils/apiError.js';

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  return next(new ApiError("access denied", 403));
}

export default isAuthenticated;
