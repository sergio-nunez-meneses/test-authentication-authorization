const ash = require('express-async-handler');
const db = require('../models/index');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const Joi = require('joi');
const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required(),
  email: Joi.string()
    .min(5)
    .max(100)
    .required()
    .email(),
  password: Joi.string()
    .min(3)
    .max(255)
    .required(),
  confirmPassword: Joi.string()
    .equal(Joi.ref('password'))
    .required()
})
  .with('password', 'confirmPassword');

router.get('/current', auth, ash(async function(req, res) {
  console.log('requested user', req.user); // from auth middleware

  const user = await db.User.findByPk(req.user.id);
  res.send(user);
}));

router.post('/', ash(async function(req, res) {
  const formValidation = userSchema.validate(req.body);

  if (formValidation.error) {
    return res.status(400).send(formValidation.error.details[0].message);
  }

  const user = await db.User.findOne({ where: { name: req.body.name } });

  if (user) {
    return res.status(400).send('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await db.User.create({
    name: req.body.name,
    password: hashedPassword,
    email: req.body.email
  });
  console.log('new user', newUser); // for debugging

  const token = newUser.generateAuthenticationToken();
  console.log('generated token:', token); // for debugging

  res.header('x-access-token', token)
    .send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    });
}));

module.exports = router;
