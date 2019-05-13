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
    user: req.user
  });
});

router.get('/steam', steamLogin.authenticate());

router.get('/steam/return', steamLogin.verify(), (req, res) => {
  const user = new UserModel({
    steamid: req.user._json.steamid,
    name: req.user._json.personaname,
    url: req.user._json.profileurl,
    avatar: req.user.avatar.medium
  });

  user.newSession(req.sessionID);

  res.json({
    sessionID: req.sessionID,
    session: req.session,
    token,
    user
  });
});

router.get('/logout', steamLogin.enforceLogin('/'), (req, res) => {
  req.logout();
});

module.exports = router;
