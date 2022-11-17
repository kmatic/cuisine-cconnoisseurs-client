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
        const profile = await User.findById(req.params.profileid).select('_id username posts friends requests created').exec();
        if (!profile) {
            return res.status(400).json({ error: 'User not found' });
        }
        res.status(200).json({ profile });
    } catch (err) {
        return next(err);
    }
}