const ash = require('express-async-handler');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = ash(async function(req, res, next) {
  const token = req.headers['x-access-token'] || req.headers['x-auth-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access denied: no token provided.');
  }

  const decoded = await jwt.verify(token, config.get('myprivatekey'));
  console.log(decoded); // for debugging

  if (decoded.length !== 0) {
    req.user = decoded;
    next();
  } else {
    res.status(400).send('Invalid token.');
  }
});
