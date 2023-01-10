const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const { S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

require('dotenv').config();

// create s3 object
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
    region: process.env.AWS_BUCKET_REGION
});


exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ created: 1 }).exec();
        if (!users) {
            return res.status(400).json({ error: 'Users not found'});
        }
        res.status(200).json({ data: users });
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
        res.status(200).json({ data: profile });
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
            }, {new: true}).select('-password').populate('followers', '_id username').exec()
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

exports.uploadProfilePicture = async (req, res, next) => {    
    const file = req.file
    const id = req.params.profileid // by making the key the profileid, when user uploads new profile picture, it automatically overwrites existing one
    
    console.log(id)

    const fileBuffer = await sharp(file.buffer).resize({ height: 180, width: 180, fit: 'contain' }).toBuffer();

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: id,
        Body: fileBuffer,
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const profileUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: id,
        }),
        { expiresIn: 60} // 60 seconds
    );
    
    res.status(200).json({ profileUrl });
}