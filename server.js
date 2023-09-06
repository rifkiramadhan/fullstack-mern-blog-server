const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const dbConnect = require('./config/db/dbConnect');
const usersRoutes = require('./route/users/usersRoutes');
const { errorHandler, notFound } = require('./middlewares/error/errorHandler');
const postsRoutes = require('./route/posts/postsRoutes');
const commentsRoutes = require('./route/comments/commentsRoutes');
const emailMsgRoutes = require('./route/emailMsgRoutes/emailMsgRoutes');
const categoriesRoutes = require('./route/categories/categoriesRoutes');
const app = express();

// DB Connect
dbConnect();

// Middleware
app.use(express.json());

// Users Route
app.use('/api/users', usersRoutes);

// Post Route
app.use('/api/posts', postsRoutes);

// Comment Route
app.use('/api/comments', commentsRoutes);

// Email Msg Route
app.use('/api/email', emailMsgRoutes);

// Category Route
app.use('/api/category', categoriesRoutes);

// Err Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
