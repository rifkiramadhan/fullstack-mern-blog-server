const express = require('express');
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} = require('../../controllers/users/usersCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const {
  photoUpload,
  profilePhotoResize,
} = require('../../middlewares/uploads/photoUpload');
const usersRoutes = express.Router();

usersRoutes.post('/register', userRegisterCtrl);
usersRoutes.post('/login', loginUserCtrl);
usersRoutes.put(
  '/profilephoto-upload',
  authMiddleware,
  photoUpload.single('image'),
  profilePhotoResize,
  profilePhotoUploadCtrl
);
usersRoutes.get('/', authMiddleware, fetchUsersCtrl);
usersRoutes.post('/forget-password-token', forgetPasswordToken);
usersRoutes.put('/reset-password', passwordResetCtrl);
usersRoutes.put('/password', authMiddleware, updateUserPasswordCtrl);
usersRoutes.put('/follow', authMiddleware, followingUserCtrl);
usersRoutes.post(
  '/generate-verify-email-token',
  authMiddleware,
  generateVerificationTokenCtrl
);
usersRoutes.put('/verify-account', authMiddleware, accountVerificationCtrl);
usersRoutes.put('/unfollow', authMiddleware, unfollowUserCtrl);
usersRoutes.put('/block-user/:id', authMiddleware, blockUserCtrl);
usersRoutes.put('/unblock-user/:id', authMiddleware, unBlockUserCtrl);
usersRoutes.get('/profile/:id', authMiddleware, userProfileCtrl);
usersRoutes.put('/:id', authMiddleware, updateUserCtrl);
usersRoutes.delete('/:id', deleteUsersCtrl);
usersRoutes.get('/:id', fetchUserDetailsCtrl);

module.exports = usersRoutes;
