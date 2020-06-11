const Bootcamp = require('../models/Bootcamps');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @desc            Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc            Get single bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc            Post bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user;
  const publishedBootcamps = await Bootcamp.findOne({ user: req.user.id });
  if (publishedBootcamps && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc            Update bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} is not authorized to update bootcamp`,
        401
      )
    );
  }
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc            Delete bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  // Check if bootcamp exists
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  // Make sure user is bootcamp owner or admin
  if (req.user.toString() !== bootcamp.user && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} is not authorized to delete this bootcamp`
      ),
      401
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc            Get bootcamps within a radius
// @route           GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access          private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });
  console.log(bootcamps);

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc      Upload bootcamp photo
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.id}`, 404)
    );
  }
  if (req.user.toString() !== bootcamp.user && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} is not authorized to upload photo`
      ),
      401
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload an image file`), 400);
  }
  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file'), 404);
  }
  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
      ),
      400
    );
  }
  // Create custom filename
  file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;
  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse('Problem with file upload', 500));
    }
    // Save file to db
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
