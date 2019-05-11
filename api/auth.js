const express = require('express');
const router = express.Router();
const { signsession } = require('../util');
const steamLogin = require('steam-login');
const { steam: steamcfg } = require('../config.js');

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
  const token = signsession(req.sessionID);

  res.json({
    sessionID: req.sessionID,
    session: req.session,
    token,
    user: req.user
  });
});

router.get('/logout', steamLogin.enforceLogin('/'), (req, res) => {
  req.logout();
});

module.exports = router;
