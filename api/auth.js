const express = require('express');
const router = express.Router();
const passport = require('passport');

console.log('[EXPRESS] > auth route');

const passportConfig = require('../config/passport.js');

router.use(passport.initialize());
passportConfig();

router.get('/steam',
  passport.authenticate('steam')
);

router.get('/steam/return',
  passport.authenticate('steam'),
  function(req, res) {
    console.log('[PASSPORT] > (GET /auth/steam/return) next function');
    res.json({ status: "OK" });
  });

router.get('/', (req, res) => {
    console.log('[AUTH] > (GET /auth) next function');
    res.json({ status: 'user ok' });
});

module.exports = router;
