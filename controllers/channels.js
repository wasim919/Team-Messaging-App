const Channel = require('../models/Channel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc            Get all channels
// @route           GET /api/v1/channels
// @access          Public
exports.getChannels = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc            Get Channel
// @route           GET /api/v1/channels/:id
// @access          Public
exports.getChannel = asyncHandler(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) {
    return next(
      new ErrorResponse(`Channel not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc            Post channel
// @route           POST /api/v1/channels
// @access          Private
exports.createChannel = asyncHandler(async (req, res, next) => {
  req.body.user = req.user;
  const publishedChannels = await Channel.findOne({ user: req.user.id });
  // User can create only one channel
  // if (publishedChannels && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `The user with id ${req.user.id} has already created a channel`,
  //       400
  //     )
  //   );
  // }
  const channel = await Channel.create(req.body);
  res.status(201).json({ success: true, data: channel });
});

// @desc            Update Channel
// @route           PUT /api/v1/channels/:id
// @access          Private
exports.updateChannel = asyncHandler(async (req, res, next) => {
  let channel = await Channel.findById(req.params.id);
  if (!channel) {
    return next(
      new ErrorResponse(`Channel not found with id of ${req.params.id}`, 404)
    );
  }
  if (channel.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} is not authorized to update channel`,
        401
      )
    );
  }
  channel = await Channel.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: channel });
});

// @desc            Delete channel
// @route           DELETE /api/v1/channels/:id
// @access          Private
exports.deleteChannel = asyncHandler(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);
  // Check if channel exists
  if (!channel) {
    return res.status(400).json({ success: false });
  }
  // Make sure user is channel owner or admin

  channel.remove();
  res.status(200).json({ success: true, data: {} });
});
