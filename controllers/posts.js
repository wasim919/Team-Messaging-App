const asyncHandler = require('../middleware/async');
const Post = require('../models/Post');
const Channel = require('../models/Channel');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get single post
// @route       GET /api/v1/posts
// @route       GET /api/v1/channels/:channelId/posts
// @access      Private
exports.getPosts = asyncHandler(async (req, res, next) => {
  if (req.params.channelId) {
    const posts = await Post.find({
      channel: req.params.channelId,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Add post specific to a channel
// @route       POST /api/v1/channels/:channelId/posts
// @access      Private
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.channel = req.params.channelId;
  req.body.user = req.user;
  const channel = await Channel.findById(req.params.channelId);
  if (!channel) {
    next(
      new ErrorResponse(
        `channel does not exist with id of ${req.params.channelId}`,
        404
      )
    );
  }
  const post = await Post.create(req.body);

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc        Get single post
// @route       GET /api/v1/posts/:postId
// @access      Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: 'channel',
    select: 'name description',
  });
  if (!post) {
    return next(new ErrorResponse(`No post with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc        Update a Post
// @route       PUT Papi/v1/posts/:id
// @access      Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse(`No post with id of ${req.params.id}`, 404));
  }
  if (post.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} is not authorized to update course ${post._id}`,
        401
      )
    );
  }
  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc        Remove post
// @route       DELETE /api/v1/posts/:id
// @access      Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse(`No post with id of ${req.params.id}`, 404));
  }
  if (post.user.toString() !== req.user.id) {
    return new ErrorResponse(
      `User with id ${req.user.id} is not authorized to delete post ${course._id}`,
      401
    );
  }
  await post.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
