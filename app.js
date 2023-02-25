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

// Navigation
app.get("", async (req, res) => {
  const posts = await Post.find();
  res.render("index", { title: "Trang Chủ", posts });
});

app.get("/details/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  // const post = new Post({
  //   title: "Nhà trọ 55/4, Trần Việt Châu",
  //   description: "Nhà trọ thoáng mát, sạch sẽ, có chỗ để xe",
  //   address: "82/12 Nguyễn Xí, Phường 26, Quận Bình Thạnh, Hồ Chí Minh",
  //   price: 2000000,
  //   phone: "0123456789",
  //   createAt: Date.now(),
  // });
  // try {
  //   await post.save();
  // } catch (error) {
  //   console.log(error);
  // }

  res.render("postDetails", { title: "Chi Tiết", post });
});

app.listen(port, () => console.info(`App listening on port ${port}`));
