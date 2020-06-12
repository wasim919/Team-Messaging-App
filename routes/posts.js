const express = require('express');
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require('../controllers/posts');
const { protect } = require('../middleware/auth');

const Post = require('../models/Post');

const advancedResults = require('../middleware/advancedResults');

// You must pass {mergeParams: true} to the child router
// if you want to access the params of the parent router.

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Post, {
      path: 'channel',
      select: 'name description',
    }),
    getPosts
  )
  .post(protect, createPost);

router
  .route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
