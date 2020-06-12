const express = require('express');
const router = express.Router();
const {
  getChannels,
  getChannel,
  getUserChannel,
  createChannel,
  updateChannel,
  deleteChannel,
} = require('../controllers/channels');

const Channel = require('../models/Channel');

const { protect } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

// // Include other resource router
const postRouter = require('./posts');

// // Re-route to other resource router
router.use('/:channelId/posts', postRouter);

router
  .route('/')
  .get(advancedResults(Channel, 'posts'), getChannels)
  .post(protect, createChannel);

router
  .route('/:id')
  .get(getChannel)
  .put(protect, updateChannel)
  .delete(protect, deleteChannel);

module.exports = router;
