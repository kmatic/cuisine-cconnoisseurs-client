const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('_id username').sort({ created: 1 }).exec();
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
        const profile = await User.findById(req.params.profileid).select('_id username posts friends requests created bio city').exec();
        if (!profile) {
            return res.status(400).json({ error: 'User not found' });
        }
        res.status(200).json({ profile });
    } catch (err) {
        return next(err);
    }
}

exports.follow = async (req, res, next) => {
    try {
        const newFollower = await User.updateOne({ _id: req.params.profileid }, {$set: {
            followers: req.body.followers,
        }})
        const newFollowing = await User.updateOne({ _id: req.body.user }, {$set: {
            following: req.body.user.following,
        }})
        res.status(200).json({ newFollowing });
    } catch (err) {
        return next(err);
    }
}

exports.updateUser= async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.profileid, {
            city: req.body.city,
            bio: req.body.bio
        }, {new: true}).exec()
        res.status(200).json({ updatedUser });
    } catch (err) {
        return next(err);
    }
}