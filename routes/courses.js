const express = require('express');
const {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');
const { protect, authorize } = require('../middleware/auth');

const Course = require('../models/Courses');

const advancedResults = require('../middleware/advancedResults');

// You must pass {mergeParams: true} to the child router
// if you want to access the params of the parent router.

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('admin', 'publisher'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'publisher'), updateCourse)
  .delete(protect, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;
