const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

require('dotenv').config();

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username}, (err, user) => {
            if (err) return done(err);
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            bcrypt.compare(password, user.password, (err, match) => {
                if (match) {
                    return done(null, user, { message: 'Login successful' });
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            });
        });
    })
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY
    },
    (token, done) => {
        try {
            return done(null, token.user);
        } catch (err) {
            return done(null, false, { err });
        }
    }
));