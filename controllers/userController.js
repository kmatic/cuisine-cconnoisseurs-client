const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

exports.signup = [
    body('username')
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage('Username must be specified'),
    body('username').custom(async (username) => {
        try {
            const found = await User.findOne({ username: username }).exec();
            if (found) {
                throw new Error('Username exists');
            }
        } catch (err) {
            throw new Error(err);
        }
    }),
    body('password')
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage('Password must be specified.'),
    body('passwordConfirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                username: req.body.username,
                errors: errors.array()[0],
            })
        } 
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            await User.create({
                username: req.body.username,
                password: hashedPassword
            });

            res.status(200).json({ message: 'Account created' })

        } catch (err) {
            return next(err);
        }
    }
];

exports.login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                user: user,
                errors: info,
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) return next(err);
            const token = jwt.sign({user}, process.env.SECRET_KEY, { expiresIn: '1d' });
            const { _id, username, posts, following, followers, created } = user;
            return res.status(200).json({ 
                token: token,
                user: {
                    _id, username, posts, following, followers, created,
                },
                message: 'Login successful!'  
            });
        });
    })(req, res, next);
}

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/api');
    })
}