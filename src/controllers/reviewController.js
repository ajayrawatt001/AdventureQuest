const Review = require('./../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  // Allow nexted routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
};

const getAllReviews = getAll(Review);
const createReviews = createOne(Review);
const getReview = getOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);
module.exports = {
  getAllReviews,
  createReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
};
