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
// Specific folder example
// app.use("/css", express.static(__dirname + "public/css"));
// app.use("/js", express.static(__dirname + "public/js"));
// app.use("/img", express.static(__dirname + "public/img"));

// Set View's
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Navigation
app.get('', (req, res) => {
  res.render('index', { title: 'Trang Chủ' });
});

app.get('/details', async (req, res) => {
  const post = new Post({
    title: ' NHÀ TRỌ SẠCH SẼ - CHO THUÊ PHÒNG TRỌ GẦN BẾN XE MIỀN ĐÔNG CŨ',
    description: '82/12 Nguyễn Xí, Phường 26, Quận Bình Thạnh, Hồ Chí Minh',
  });

  res.render('postDetails', { title: 'Chi Tiết', post });
});

app.listen(port, () => console.info(`App listening on port ${port}`));
