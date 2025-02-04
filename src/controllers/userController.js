import asyncWrapper from './../middlewares/asyncWrapper.js';

export const getMe = asyncWrapper(async (req, res) => {
  const { user } = req;
  res.status(200).json({ status: "success", data: {user} });
})
