const SteamStrategy = require('passport-steam').Strategy;

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
    // save user to db
    
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
