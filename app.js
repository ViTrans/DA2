// Imports
const express = require('express');
const app = express();
const port = 5000;
require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("./src/models/posts");

// conect DB
// Connection URL. This is where your mongodb server is running.
mongoose.set('strictQuery', true);
const conectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }
};
conectDB();
mongoose.connection.once('open', () => {
  console.log('connection open');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static('public'));

// Set View's
app.set('views', './src/views');
app.set('view engine', 'ejs');


app.use("/", homePageRouter);
app.use("/", homePageRouter);
app.use("/", signupRouter);
app.use("/", signinRouter);
=======


});

app.listen(port, () => console.info(`App listening on port ${port}`));
