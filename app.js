// Imports
const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const createError = require('http-errors');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const homePageRouter = require('./src/routes/homePage');
const signupRouter = require('./src/routes/signupRouter');
const signinRouter = require('./src/routes/signinRouter');
// const flash = require('connect-flash');
const moment = require('moment');
const postRouter = require('./src/routes/post');
const categoryRouter = require('./src/routes/category');
const packageRouter = require('./src/routes/package');
const paymentRouter = require('./src/routes/payment');
const depositHistoryRouter = require('./src/routes/depositHistory');
const category = require('./src/models/category');
const Post = require('./src/models/posts');

const postDetails = require('./src/routes/postDetails');
const session = require('express-session');
// const getPostNew = require('./src/middlewares/getPostNew');
// const cryptoRandomString = require('crypto-random-string');
// const cron = require('node-cron');
// cron.schedule('* * * * *', async () => {
//
//   await updateExpiredPosts();
// });
// 24 tiếng
// cron.schedule('0 0 */1 * * *', async () => {
//   await updateExpiredPosts();
// });
// 5 p
// cron.schedule('*/5 * * * *', async () => {
//   await updateExpiredPosts();
//
// });

// conect DB
// Connection URL. This is where your mongodb server is running.
mongoose.set('strictQuery', true);
const conectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'doan2',
    });
  } catch (error) {}
};
conectDB();

mongoose.connection.once('open', () => {});

// demo

const updateExpiredPosts = async () => {
  const expiredPosts = await Post.find({ isvip: { $ne: 'vip0' }, expired_at: { $lt: new Date() } });
  expiredPosts.forEach(async (post) => {
    post.isvip = 'vip0';
    post.expired_at = null;
    await post.save();
  });
};

// demo

// api
app.use(
  session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
  })
);
// app.use(getPostNew);

// const getCategories = async (req, res, next) => {
//   const categories = await category.find();
//   res.locals.categories = categories;
//   next();
// };
// app.use(getCategories);

// Static Files
app.use(express.static('public'));

// api

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', require('./src/routes/api/user'));
app.use('/api/v1/packages', require('./src/routes/api/package'));
app.use('/api/v1/posts', require('./src/routes/api/post'));
app.use('/api/v1/categories', require('./src/routes/api/category'));
app.use('/api/v1/payment', require('./src/routes/api/payment'));

app.use('/', require('./src/routes/profileRoute'));
app.use('/api/v1/profile', require('./src/routes/api/profile'));
app.use('/', require('./src/routes/statisticsRouter'));
app.use('/api/v1/statistics', require('./src/routes/api/statistics'));

app.use('/api/v1/depositHistory', require('./src/routes/api/depositHistory'));

// Middleware
let categories = [];
let postsNew = [];
let isRunMiddleware = false;
app.use(async (req, res, next) => {
  if (isRunMiddleware == false) {
    console.log('chay 1 lần');
    categories = await category.find();
    postsNew = await Post.find().sort({ createdAt: -1 }).limit(5);
    await updateExpiredPosts();
    isRunMiddleware = true;
  }
  res.locals.moment = moment;
  res.locals.postsNew = postsNew;
  res.locals.categories = categories;

  console.log('chay n 2');
  next();
});

// const getCategories = async (req, res, next) => {
//   const categories = await category.find();
//   res.locals.categories = categories;
//   console.log('cate gories');
//   next();
// };

// Static Files
app.use(express.static('public'));

// Set View's
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use('/posts', postRouter);
app.use('/managePost', require('./src/routes/postAdmin'));
app.use('/categories', categoryRouter);
app.use('/packages', packageRouter);
app.use('/payment', paymentRouter);
app.use('/depositHistory', depositHistoryRouter);
app.use(expressLayouts);
app.set('layout', './layouts/layout');
app.use('/', homePageRouter);
app.use('/details', postDetails);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/', signinRouter);
app.use('/forgot-password', require('./src/routes/forgot-password'));
app.use('/reset-password', require('./src/routes/reset-password'));

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
