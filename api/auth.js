const express = require('express');
const router = express.Router();
const steamLogin = require('steam-login');
const { steam: steamcfg } = require('../config.js');
const UserModel = require('../models/User.js');
const { devLog } = require('../util');

router.use(steamLogin.middleware(steamcfg));

const checkAuth = function (req, res, next) {
  const token = req.cookies.authToken;

  return UserModel.find().then(usr => {
    return usr.forEach(user => {
      const check = user.checkToken(token);

      if (check.err === null) return next();

      return res.json({
        auth: "NO",
        sessionID: req.sessionID,
        session: req.session,
        cookie: req.cookies
      });
    });
  })
}

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
    devLog('MONGO','-search user')
    let user;    

    if(usr){
      devLog('MONGO','--user found')

      user = usr;
    } else {
      devLog('MONGO','--user not found')

      user = new UserModel({
        steamid: req.user._json.steamid,
        name: req.user._json.personaname,
        url: req.user._json.profileurl,
        avatar: req.user.avatar.medium
      });
    }

    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0';
    ip = ip.split(':')[3];
    
    const token = user.newSession(req.sessionID,ip);
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
    devLog('MONGO','-error found');
    devLog('MONGO',`-{${err.name}} ${err.message}`);
  });
});

router.get('/testAuth', (req, res) => {
  const token = req.cookies.authToken;

  UserModel.find().then(usr => {
    usr.forEach(user => {
      const check = user.checkToken(token);
      return res.json({
        auth: check.err === null ? "YES" : "NO",
        token,
        check,
        sessionID: req.sessionID,
        session: req.session,
        cookie: req.cookies
      });
    });
  })
});

router.get('/testSession', (req, res) => {
  const token = "sadfasdfasfasdfasdfsaf";

  res.cookie('authToken', token);
  res.redirect('/auth');
});



router.get('/testSession', (req, res) => {
  let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.split(':')[3];
  
  console.log(ip)
  
  res.json({ ip })
});

router.get('/testAuth2', checkAuth, (req, res) => {
  return res.json({
    "auth" : "YES"
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
