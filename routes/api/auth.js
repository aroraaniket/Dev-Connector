const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
//Get by api/auth
//first we are making router as handler
//and will export it
//to use it in server.js file
router.get('/', auth, async function (req, res) {
  //find user by findBYId using req.user in which we used token to get th user and
  // /select is used if user find by id return user without password to client
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
router.post(
  '/',
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      //check if user exist
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      //compare password see if email and password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      //send webtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '1800s' },
        function (err, token) {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
