// Imports
const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config();
const createError = require("http-errors");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const homePageRouter = require("./src/routes/homePage");
const signupRouter = require("./src/routes/signupRouter");
const signinRouter = require("./src/routes/signinRouter");
const session = require("express-session");
const flash = require("connect-flash");
const moment = require("moment");
const postRouter = require("./src/routes/post");
const categoryRouter = require("./src/routes/category");

// conect DB
// Connection URL. This is where your mongodb server is running.
mongoose.set("strictQuery", true);
const conectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "doan2",
    });
  } catch (error) {
    console.log(error);
  }
};
conectDB();

mongoose.connection.once("open", () => {
  console.log("connection open");
});

// Middleware
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
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
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use("/", homePageRouter);
app.use("/", homePageRouter);
app.use("/", signupRouter);
app.use("/", signinRouter);
app.use("/quan-ly/posts", postRouter);
app.use("/quan-ly/categories", categoryRouter);

// Middleware handle errors
app.use((req, res, next) => {
  next(createError.NotFound("đường dẫn truy cập máy chủ không hợp lệ"));
});

app.use((err, req, res, next) => {
  res.json({
    code: err.status || 500,
    msg: err.message,
  });
});

app.listen(port, () => console.info(`App listening on port ${port}`));
