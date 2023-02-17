const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
// static files

app.use('/', express.static(path.join(__dirname, '/public')));

//localhost:3000/demo/user.html
//localhost:3000/demo/user
http: app.use('/demo', require('./routes/test'));

// app.use(express.static("public"));
// app.use("/css", express.static(__dirname + "public/css"));
// app.use("/js", express.static(__dirname + "public/js"));
// app.use("/img", express.static(__dirname + "public/img"));
// app.use("views", express.static(__dirname + "views"));
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.render('index');
});
