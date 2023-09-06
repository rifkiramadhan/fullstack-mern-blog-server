const express = require('express');
const {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} = require('../../controllers/comments/commentsCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const commentsRoutes = express.Router();

commentsRoutes.post('/', authMiddleware, createCommentCtrl);
commentsRoutes.get('/', authMiddleware, fetchAllCommentsCtrl);
commentsRoutes.get('/:id', authMiddleware, fetchCommentCtrl);
commentsRoutes.put('/:id', authMiddleware, updateCommentCtrl);
commentsRoutes.delete('/:id', authMiddleware, deleteCommentCtrl);

module.exports = commentsRoutes;
