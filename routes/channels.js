const express = require('express');
const router = express.Router();
const {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
} = require('../controllers/channels');

const Channel = require('../models/Channel');

const { protect } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

// // Include other resource router
// const courseRouter = require('./courses');
// const reviewRouter = require('./reviews');

// // Re-route to other resource router
// router.use('/:bootcampId/courses', courseRouter);
// router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Channel, 'courses'), getChannels)
  .post(protect, createChannel);

router
  .route('/:id')
  .get(getChannel)
  .put(protect, updateChannel)
  .delete(protect, deleteChannel);

module.exports = router;
