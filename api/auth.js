const express = require('express');
const router = express.Router();
const steamLogin = require('steam-login');
const { steam: steamcfg } = require('../config.js');
const UserModel = require('../models/User.js');
const { devLog } = require('../util');

router.use(steamLogin.middleware(steamcfg));

router.get('/', (req, res) => {
  return res.json({
    sessionID: req.sessionID,
    session: req.session,
    cookie: req.cookies
  });
});

router.get('/steam', steamLogin.authenticate());

router.get('/steam/return', steamLogin.verify(), (req, res, next) => {
  const steamid = req.user._json.steamid;

  return UserModel.findOne({ steamid }).then(usr => {
    devLog('MONGO','search user')
    let user;    

    if(usr){
      devLog('MONGO','user found')

      user = usr;
    } else {
      devLog('MONGO','user not found')

      user = new UserModel({
        steamid: req.user._json.steamid,
        name: req.user._json.personaname,
        url: req.user._json.profileurl,
        avatar: req.user.avatar.medium
      });
    }

    const token = user.newSession(req.sessionID,'0.0.0.0');
    user.save();

    // res.clearCookie('authToken');
    // res.cookie('authToken', token, { domain: '.example.com', path: '/admin', secure: true, expires: new Date(Date.now() + 900000), });
    res.cookie('authToken', token,);
    // req.session.a3i_user = user;
  
    return res.json({
      sessionID: req.sessionID,
      token,
      session: req.session,
      // user
    });

  }).catch(err => {
    devLog('MONGO','error found');
    devLog('MONGO',`{${err.name}} ${err.message}`);
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('authToken');
  // req.logout();

  return res.json({
    sessionID: req.sessionID,
    session: req.session,
    cookie: req.cookies
  });
});

module.exports = router;
