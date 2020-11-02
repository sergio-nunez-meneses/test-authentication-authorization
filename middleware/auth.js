const ash = require('express-async-handler');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = ash(async function(req, res, next) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access denied: No token provided.');
  }

  const decoded = await jwt.verify(token, config.get('myprivatekey'));
  console.log(decoded);
});
