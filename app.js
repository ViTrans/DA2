// Imports
const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./src/models/posts');
// doan2
// ugfKheQaKRTaKRzA;
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
  let post = new Post({
    title: ' NHÀ aa TRỌ SẠCH SẼ 9999- CHO THUÊ PHÒNG TRỌ GẦN BẾN XE MIỀN ĐÔNG CŨ',
    address: '82/12 Nguyễn Xí 3, Phường 26, Quận Bình Thạnh, Hà Nội',
  });

  try {
    await post.save();
  } catch (error) {
    console.log(error);
  }

  res.render('postDetails', { title: 'Chi Tiết', post });
});

app.listen(port, () => console.info(`App listening on port ${port}`));
