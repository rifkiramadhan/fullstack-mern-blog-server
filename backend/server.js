const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const dbConnect = require('./config/db/dbConnect');
const usersRoute = require('./route/users/usersRoute');
const { errorHandler, notFound } = require('./middlewares/error/errorHandler');
const app = express();

// DB Connect
dbConnect();

// Middleware
app.use(express.json());

// Users Route
app.use('/api/users', usersRoute);

// Err Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
