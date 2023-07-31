const express = require('express');
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUserCtrl,
  deleteUserCtrl,
} = require('../../controllers/users/usersCtrl');

const userRoutes = express.Router();

userRoutes.post('/register', userRegisterCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/', fetchUserCtrl);
userRoutes.delete('/:id', deleteUserCtrl);

module.exports = userRoutes;
