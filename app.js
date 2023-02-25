// Imports
const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./src/models/posts');

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
  } catch (error) {
    console.log(error);
  }
};
conectDB();
mongoose.connection.once('open', () => {
  console.log('connection open');
});

// Static Files
app.use(express.static('public'));

// Set View's
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Navigation
app.get('', async (req, res) => {
  const post = new Post({
    title: 'Nhà trọ 109/23, Trần Duy Hung',
    description: 'Nhà trọ thoáng mát, sạch sẽ, có chỗ để xe,hồ bơi',
    address: '82/12 Nguyễn Xí, Phường 26, Quận Bình Thạnh, Hồ Chí Minh',
    price: 300000,
    phone: '0334133252',
    createAt: Date.now(),
  });
  await post.save();
  const posts = await Post.find();

  res.render('index', { title: 'Trang Chủ', posts });
});

app.get('/details/:id', async (req, res) => {
  console.log(req.params);
  const post = await Post.findById(req.params.id);

  try {
    await post.save();
  } catch (error) {
    console.log(error);
  }

  res.render('postDetails', { title: 'Chi Tiết', post });
});

app.listen(port, () => console.info(`App listening on port ${port}`));
