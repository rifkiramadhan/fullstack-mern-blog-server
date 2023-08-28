const expressAsyncHandler = require('express-async-handler');
const Filter = require('bad-words');
const fs = require('fs');
const Post = require('../../model/post/Post');
const validateMongodbId = require('../../utils/validateMongodbID');
const User = require('../../model/user/User');
const cloudinaryUploadImg = require('../../utils/cloudinary');

//-------------------------------------
// Create Post
//-------------------------------------
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.file);

  const { _id } = req.user;

  // validateMongodbId(req.body.user);

  // Check For Bad Words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  // Block User
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });

    throw new Error(
      'Creating Failed because it contains profane words and you have been blocked'
    );
  }

  //1. Get the oath to img
  const localPath = `public/images/posts/${req.file.filename}`;

  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    // const post = await Post.create({
    //   ...req.body,
    //   image: imgUploaded?.url,
    //   user: _id,
    // });
    res.json(imgUploaded);
    //Remove uploaded img
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Fetch All Posts
//-------------------------------------
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate('user');
    res.json(posts);
  } catch (error) {}
});

//-------------------------------------
// Fetch a Single Post
//-------------------------------------
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // Update number of views
  await Post.findByIdAndUpdate(
    id,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );
  validateMongodbId(id);
  try {
    const post = await Post.findById(id)
      .populate('user')
      .populate('disLikes')
      .populate('likes');
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Update Post
//-------------------------------------
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Delete Post
//-------------------------------------
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findOneAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
// Likes
//-------------------------------------
const toggleAddLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  // 1. Find the post to be like
  const { postId } = req.body;
  const post = await Post.findById(postId);

  // 2. Find the login user
  const loginUserId = req?.user?._id;

  // 3. Find is this user has liked this post?
  const isLiked = post?.isLiked;

  // 4. Check if this user has dislikes this post?
  const alreadyDisliked = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // 5. Remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }

  // Toggle
  // 6 Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } else {
    // Add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
});

//-------------------------------------
// Dislikes
//-------------------------------------
const toggleAddDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  // 1. Find the post to be disLiked
  const { postId } = req.body;
  const post = await Post.findById(postId);

  // 2. Find the login user
  const loginUserId = req?.user?._id;

  // 3. Check if this user has already disLikes
  const isDisLiked = post?.isDisLiked;

  // 4. Check if already like this post
  const alreadyLiked = post?.likes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );

  // 5. Remove this user from likes array if it exists
  if (alreadyLiked) {
    const post = await Post.findOneAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }

  // Toggling
  // 6. Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
};
