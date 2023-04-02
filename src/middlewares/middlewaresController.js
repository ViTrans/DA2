const jwt = require('jsonwebtoken');
const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    console.log('token', req.headers);
    if (token) {
      const accessToken = token.split(' ')[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(403).json('Token is not valid!');
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  },
};
module.exports = middlewareController;
