const express = require('express');
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamps');

const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Re-route to other resource router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('admin', 'publisher'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('admin', 'publisher'), updateBootcamp)
  .delete(protect, authorize('admin', 'publisher'), deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photos')
  .put(protect, authorize('admin', 'publisher'), bootcampPhotoUpload);

module.exports = router;
