var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //   bearer
  console.log('middleware');
  try {
    console.log('headers info ', req.headers);
    var bearertoken = req.headers.authorization;
    console.log('bearertoken', bearertoken);
    var token = bearertoken.split(' ')[1];
    console.log('token', token);
    jwt.verify(token, 'secret', function (err, decoded) {
      console.log('pahucha?');
      if (err) {
        res.status(401).json({
          errMsg: 'Invalid token',
          err,
        });
      } else {
        req.userInfo = decoded;

        //db

        console.log('user decoded data ', decoded);
        next();
      }
    });
  } catch (error) {
    console.log('error', error);
    res.status(401).json({
      errMsg: 'Missing authorization info',
      error: error,
    });
  }
};
