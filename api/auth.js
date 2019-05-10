const express = require('express');
const router = express.Router();
const passport = require('passport');

console.log('[EXPRESS] > auth route');

const passportConfig = require('../config/passport.js');


router.use(passport.initialize());
passportConfig();

router.get('/steam',(req, res, next) => {
    console.log('[AUTH] > (GET /auth/steam)');
    next();
  },
  passport.authenticate('steam', {
    successRedirect: '/success',
    failureRedirect: '/fail',
    session: false
  },() => {
    console.log('[PASSPORT] > (GET /auth/steam) authenticate callback');
  }),
  function(req, res) {
    console.log('[PASSPORT] > (GET /auth/steam) next function');
  });

router.get('/steam/return',(req, res, next) => {
    console.log('[AUTH] > (GET /auth/steam/return)');
    next();
  },
  passport.authenticate('steam', {
    successRedirect: '/success',
    failureRedirect: '/fail',
    session: false
  },() => {
    console.log('[PASSPORT] > (GET /auth/steam/return) authenticate callback');
  }),
  function(req, res) {
    console.log('[PASSPORT] > (GET /auth/steam/return) next function');
    res.redirect('/');
  });

router.get('/',(req, res, next) => {
    console.log('[AUTH] > (GET /auth)');
    next();
  }, (req, res) => {
    console.log('[AUTH] > (GET /auth) next function');
    res.json({ status: 'user ok' });
});

module.exports = router;
