const express = require('express');
const router = express.Router();
const steamLogin = require('steam-login');
const { steam: steamcfg } = require('../config.js');
const UserModel = require('../models/User.js');

router.use(steamLogin.middleware(steamcfg));

router.get('/', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    cookie: req.cookies
  });
});

router.get('/steam', steamLogin.authenticate());

router.get('/steam/return', steamLogin.verify(), (req, res, next) => {
  const steamid = req.user._json.steamid;

  UserModel.findOne({ steamid }).exec((err, usr) => {
    if (!err) {
      req.user = usr;
      return next();
    };
  });

  console.log('[SERVER] > New User');

  const user = new UserModel({
    steamid: req.user._json.steamid,
    name: req.user._json.personaname,
    url: req.user._json.profileurl,
    avatar: req.user.avatar.medium
  });

  req.user = user;
  next();
 
}, (req, res) => {
  console.log('[SERVER] > User loaded');

  const user = req.user;
  const token = user.newSession(req.sessionID,'0.0.0.0');

  user.save();
  // res.cookie('authToken', token, { domain: '.example.com', path: '/admin', secure: true, expires: new Date(Date.now() + 900000), });
  res.cookie('authToken', token,);
  req.session.a3i_user = user;

  res.json({
    sessionID: req.sessionID,
    token,
    session: req.session,
    // user
  });
});

router.get('/logout', steamLogin.enforceLogin('/'), (req, res) => {
  req.logout();
});

module.exports = router;
