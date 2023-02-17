const path = require('path');

const test = (req, res) => {
  res.render(path.join(__dirname, '..', 'views', 'test', 'test.ejs'));
};

module.exports = {
  test,
};
