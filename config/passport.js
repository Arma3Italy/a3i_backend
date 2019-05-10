const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cfg = require('../config.js');

console.log('[PASSPORT] > passportConfig');

function passportConfig() {
  passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8801/auth/steam/return',
    realm: 'http://localhost:8801/auth/',
    apiKey: cfg.server.steam_token
  },
  function(identifier, profile, done) {
    console.log('[PASSPORT] > SteamStrategy');
    const user = {
        openid: identifier,
        steam_id: profile._json.steamid,
        name: profile._json.personaname,
        dateTest: profile._json.lastlogoff,
        profile_url: profile._json.profileurl,
        avatar: profile._json.avatar,
    }
    // save user to db
    
    return done(null,user);
  }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.openid);
    console.log('[PASSPORT] > serializeUser');
  // console.log(user);
  });

  passport.deserializeUser(function(id, done) {
    console.log('[PASSPORT] > deserializeUser');
  // User.findById(id, function(err, user) {
  //     done(err, user);
  // });
  });

}

module.exports = passportConfig;