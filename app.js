// Imports
const express = require("express");
const app = express();
const port = 5000;
require('dotenv').config();
const mongoose = require('mongoose');
const createError = require('http-errors');
const homePageRouter = require('./src/routes/homePage');
const signupRouter = require('./src/routes/signupRouter');
const signinRouter = require('./src/routes/signinRouter');
const session = require('express-session');
const flash = require('connect-flash');
const Post = require('./src/models/posts');

// router

const postRouter = require('./src/routes/post');

// connect DB
require('./src/helpers/connectDB');

// Middleware
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

const getUser = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};
app.use(getUser);

// Static Files
app.use(express.static("public"));

// Set View's
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.get('/demo', (req, res) => {
  res.status(200);
  res.json({ msg: 'ahhih' });
});

// routers

app.use('/', homePageRouter);
app.use('/', homePageRouter);
app.use('/', signupRouter);
app.use('/', signinRouter);

app.use('/quan-ly/posts', postRouter);

// Middleware handle errors
app.use((req, res, next) => {
  next(createError.NotFound('đường dẫn truy cập máy chủ không hợp lệ'));
});

app.use((err, req, res, next) => {
  res.json({
    code: err.status || 500,
    msg: err.message,
  });
});

app.listen(port, () => console.info(`App listening on port ${port}`));
