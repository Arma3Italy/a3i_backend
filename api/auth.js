const express = require('express');
const router = express.Router();
const passport = require('passport');

const cfg = require('../config');
const passportConfig = require('../config/passport.js');

router.use(passport.initialize());
passportConfig();

router.get('/steam',
  passport.authenticate('steam', {
    successRedirect: '/success',
    failureRedirect: '/fail',
    session: false
  }),
  function(req, res) {
      console.log('get /steam');
  });

router.get('/steam/return',
  passport.authenticate('steam', {
    successRedirect: '/success',
    failureRedirect: '/fail',
    session: false
  }),
  function(req, res) {
    console.log(req.user)
    console.log('get /steam/return');
    res.redirect('/');
  });

router.get('/', (req, res) => {
    res.json({ status: 'user ok' });
});

module.exports = router;
