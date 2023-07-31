const expressAsyncHandler = require('express-async-handler');
const User = require('../../model/user/User');
const generateToken = require('../../config/token/generateToken');
const { validateMongodbId } = require('../utils/validateMongodbID');

//--------------------------------------
// Register
//--------------------------------------
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  // Check if user Exist
  const userExist = await User.findOne({
    email: req?.body?.email,
  });

  if (userExist) throw new Error('User already exist');

  try {
    // Reister user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//--------------------------------------
// Login
//--------------------------------------
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exist
  const userFound = await User.findOne({
    email,
  });

  // Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Login Credentials');
  }
});

//--------------------------------------
// Fetch All User
//--------------------------------------
const fetchUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//--------------------------------------
// Delete User
//--------------------------------------
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user id is valid
  validateMongodbId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUserCtrl,
  deleteUserCtrl,
};
