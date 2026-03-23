const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  // Google Strategy — only register if credentials are configured
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          // If user exists with same email, link accounts
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
            await user.save();
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }));
  } else {
    console.log('⚠️  Google OAuth not configured — skipping Google strategy');
  }

  // GitHub Strategy — only register if credentials are configured
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        githubId: profile.id,
        name: profile.displayName || profile.username,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`,
      };

      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          done(null, user);
        } else {
          // Find by email if exists
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.githubId = profile.id;
              await user.save();
              return done(null, user);
            }
          }
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }));
  } else {
    console.log('⚠️  GitHub OAuth not configured — skipping GitHub strategy');
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};