const express = require('express');
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
} = require('../../controllers/posts/postsCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const {
  photoUpload,
  postImgResize,
} = require('../../middlewares/uploads/photoUpload');

const postsRoutes = express.Router();

postsRoutes.post(
  '/',
  authMiddleware,
  photoUpload.single('image'),
  postImgResize,
  createPostCtrl
);
postsRoutes.put('/likes', authMiddleware, toggleAddLikeToPostCtrl);
postsRoutes.put('/dislikes', authMiddleware, toggleAddDislikeToPostCtrl);
postsRoutes.get('/', fetchPostsCtrl);
postsRoutes.get('/:id', fetchPostCtrl);
postsRoutes.put('/:id', authMiddleware, updatePostCtrl);
postsRoutes.delete('/:id', authMiddleware, deletePostCtrl);

module.exports = postsRoutes;
