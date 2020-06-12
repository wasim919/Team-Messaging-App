const asyncHandler = require('../middleware/async');
const Course = require('../models/Courses');
const Channel = require('../models/Channel');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get single course
// @route       GET /api/v1/courses
// @route       GET /api/v1/channels/:channelId/courses
// @access      Private
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.channelId) {
    const courses = await Course.find({
      channel: req.params.channelId,
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Add course specific to a channel
// @route       POST /api/v1/channels/:channelId/courses
// @access      Private
exports.createCourse = asyncHandler(async (req, res, next) => {
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
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc        Get single course
// @route       GET /api/v1/courses/:courseId
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'channel',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc        Update a course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404)
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc        Remove course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404)
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return new ErrorResponse(
      `User with id ${req.user.id} is not authorized to delete course ${course._id}`,
      401
    );
  }
  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
