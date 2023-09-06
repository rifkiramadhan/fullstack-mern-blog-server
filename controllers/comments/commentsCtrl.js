const expressAsyncHandler = require('express-async-handler');
const Comment = require('../../model/comment/Comment');
const validateMongodbId = require('../../utils/validateMongodbID');

//-------------------------------------
// Create Comment
//-------------------------------------
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  // 1. Get The User
  const user = req.user;

  // 2. Get The Post Id
  const { postId, description } = req.body;
  console.log(description);

  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch All Comments
//-------------------------------------
const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort('-created');
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Comment Details
//-------------------------------------
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }

  res.json('Comment Detail');
});

//-------------------------------------
// Update
//-------------------------------------
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        post: req.body?.postId,
        user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(update);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Delete Comment
//-------------------------------------
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
