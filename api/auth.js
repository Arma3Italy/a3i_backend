const express = require('express');
const router = express.Router();
const steamLogin = require('steam-login');
const { steam: steamcfg } = require('../config.js');
const UserModel = require('../models/User.js');
const { devLog } = require('../util');

router.use(steamLogin.middleware(steamcfg));

const checkAuth = function (req, res, next) {
  [userID, token] = req.cookies.authToken.split('.');
  let errMsg = "Error unknown";

  return UserModel.findById(userID).then(user => {
    const check = user.checkToken(token);

    if (check.err === null) return next();
    errMsg = check.err;

  }).catch(err => {
    console.log(err)
    errMsg = "User not found"
    
  }).finally(x => {
    return res.json({
      auth: "NO",
      error: errMsg,
      cookie: req.cookies,
    });
  });

}

router.get('/', (req, res) => {
  return res.json({
    sessionID: req.sessionID,
    cookie: req.cookies,
  });
});

router.get('/steam', steamLogin.authenticate());

router.get('/steam/return', steamLogin.verify(), (req, res, next) => {
  const steamid = req.user._json.steamid;

  devLog('MONGO',`search user with ID: ${steamid}`)
  return UserModel.findOne({ "user_info.steamid": steamid  }).then(usr => {
    let user;    

    if(usr){
      devLog('MONGO','user found')

      user = usr;
    } else {
      devLog('MONGO',`user with ID ${steamid} not found`)

      user = new UserModel({  
        user_info:{
          steamid: req.user._json.steamid,
          name: req.user._json.personaname,
          url: req.user._json.profileurl,
          avatar: req.user.avatar.medium,
        },
        signup_date: new Date(),
        profileUpdate_date: new Date(),
      });
      devLog('MONGO',`user model for ID ${steamid} created`)
    }

    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0';
    ip = ip.split(':')[3];
    
    const token = user.newSession(req.sessionID,ip,steamid);
    user.save();
    devLog('MONGO',`user model of ID ${steamid} saved`)

    const userInfoForCookie = `${user._id}.${token}`

    res.clearCookie('authToken');
    // res.cookie('authToken', userInfoForCookie, { 
    //   domain: '.example.com', 
    //   path: '/admin', 
    //   secure: true, 
    //   expires: new Date(Date.now() + 900000),
    // });
    res.cookie('authToken', userInfoForCookie,);
    // req.session.a3i_user = user;
    devLog('MONGO',`added cookie for user with ID ${steamid}`)

    return res.json({ user });

  }).catch(err => {
    devLog('MONGO','error with database');
    devLog('MONGO',`{${err.name}} ${err.message}`);
  });
});

router.get('/testAuth', (req, res) => {
  const token = req.cookies.authToken;

  return UserModel.find().then(usr => {
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
  }).catch(err => {
    return res.status(400).json({error: err})
  })
});

router.get('/testAuth2', checkAuth, (req, res) => {
  return res.json({
    "auth" : "YES",
    cookie: req.cookies,
  });
});

router.get('/testSession', (req, res) => {
  const token = "5df68e59e356ad12a86cfa86.sadfasdfasfasdfasdfsaf";

  res.cookie('authToken', token);
  res.redirect('/auth');
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
