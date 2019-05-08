const express = require('express');
const router = express.Router();

const cfg = require('../config');

const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

router.use(passport.initialize())

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8801/user/steam/return',
    realm: 'http://localhost:8801/user/',
    apiKey: cfg.server.steam_token
  },
  function(identifier, profile, done) {
    const user = {
        openid: identifier,
        steam_id: profile._json.steamid,
        name: profile._json.personaname,
        dateTest: profile._json.lastlogoff,
        profile_url: profile._json.profileurl,
        avatar: profile._json.avatar,
    }
    return done(null,user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.openid);
  // console.log(user);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
  //     done(err, user);
  // });
});

router.get('/steam',
  passport.authenticate('steam', { session: false }),
  function(req, res) {
      console.log('get /steam');
  });

router.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/user/steam' }),
  function(req, res) {
    console.log(req.user)
    console.log('get /steam/return');
    res.redirect('/');
  });

router.get('/', (req, res) => {
    res.json({ status: 'user ok' });
});

module.exports = router;