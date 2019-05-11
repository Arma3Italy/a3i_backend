const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const passportConfig = require('../config/passport.js');
const crypto = require('crypto');

const KEY = 'sadfg43t43tv23tf';

router.use(session({
  secret: 'gz3g35z3fz5gz43h6365u3fgz',
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));


router.use(passport.initialize());
passportConfig();

router.get('/steam',
  passport.authenticate('steam')
);

router.get('/steam/return',
  passport.authenticate('steam'),
  function(req, res) {

    console.log(req.sessionID)
    const hash = crypto.createHmac('sha256', KEY).update(req.sessionID).digest('hex');

    const token = Buffer.from(`${req.sessionID}.${hash}`).toString('base64');

    const user = req.user;
    user.sessions.push(token);

    

    res.json({ status: "OK", token, user });
  });

router.get('/', (req, res) => {
    res.json({ status: 'user ok' });
});

module.exports = router;
