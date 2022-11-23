const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ created: 1 }).exec();
        if (!users) {
            return res.status(400).json({ error: 'Users not found'});
        }
        res.status(200).json({ users });
    } catch (err) {
        return next(err);
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await User.findById(req.params.profileid).select('-password').populate('followers', '_id username').exec();
        if (!profile) {
            return res.status(400).json({ error: 'User not found' });
        }
        res.status(200).json({ profile });
    } catch (err) {
        return next(err);
    }
}

exports.updateUser = [
    body('city', 'City required').escape().optional(),
    body('bio', 'Message required').escape().optional(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.profileid, {
                city: req.body.city,
                bio: req.body.bio
            }, {new: true}).select('-password').exec()
            res.status(200).json({ updatedUser });
        } catch (err) {
            return next(err);
        }
    }
]

exports.follow = async (req, res, next) => {
    try {
        const updatedFollowedUser = await User.findByIdAndUpdate(req.params.profileid, {
            followers: req.body.followers,
        }).exec();
        const updatedCurrentUser = await User.findByIdAndUpdate(req.body.user, {
            following: req.body.following,
        }, {new: true}).select('-password').exec();
        res.status(200).json({ user: updatedCurrentUser });
    } catch (err) {
        return next(err);
    }
}

exports.unfollow = async (req, res, next) => { // exact as follow controller. This will be removed when refactored
    try {
        const updatedFollowedUser = await User.findByIdAndUpdate(req.params.profileid, {
            followers: req.body.followers,
        }).exec();
        const updatedCurrentUser = await User.findByIdAndUpdate(req.body.user, {
            following: req.body.following,
        }, {new: true}).select('-password').exec();
        res.status(200).json({ user: updatedCurrentUser });
    } catch (err) {
        return next(err);
    }
}