const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const sharp = require('sharp');
const s3 = require('../config/s3');
const { PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const mongoose = require('mongoose');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ created: 1 }).lean().exec();
        if (!users) {
            return res.status(400).json({ error: 'Users not found'});
        }

        for (let user of users) {
            let imageUrl = false;
            if (user.profileImage === true) {
                imageUrl = await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: user._id.toString(),
                    }),
                    { expiresIn: 60 } // 60 seconds
                );
            };
            user.imageUrl = imageUrl;
        }

        res.status(200).json({ data: users });
    } catch (err) {
        return next(err);
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await User.findById(req.params.profileid)
            .select('-password')
            .populate('followers', '_id username profileImage')
            .lean()
            .exec();
        if (!profile) {
            return res.status(400).json({ error: 'User not found' });
        }

        let imageUrl = false;
        // retrieve signed url for profile pic from s3 bucket if picture exists
        if (profile.profileImage === true) {
            imageUrl = await getSignedUrl(
                s3,
                new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: req.params.profileid,
                }),
                { expiresIn: 60} // 60 seconds
            );
        }

        profile.imageUrl = imageUrl;

        // retrieve profile picture signed urls of followers 
        for (let follower of profile.followers) {
            imageUrl = false;
            if (follower.profileImage === true) {
                imageUrl = await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: follower._id.toString(),
                    }),
                    { expiresIn: 60 } // 60 seconds
                );
            };
            follower.imageUrl = imageUrl;
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
                errors: errors.array()[0],
            });
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.profileid, {
                city: req.body.city,
                bio: req.body.bio
            }, {new: true}).select('-password').populate('followers', '_id username').exec()
            res.status(200).json({ updatedUser, message: 'Bio changes saved!' });
        } catch (err) {
            return next(err);
        }
    }
]

exports.follow = async (req, res, next) => {
    try {
        const followedUser = await User.findById(req.params.profileid).exec();
        const currentUser = await User.findById(req.body.user).exec();

        followedUser.followers = [...followedUser.followers, req.body.user];
        currentUser.following = [...currentUser.following, req.params.profileid];

        await followedUser.save();
        await currentUser.save();

        res.status(200).json({ currentUser });
    } catch (err) {
        return next(err);
    }
}

exports.unfollow = async (req, res, next) => { 
    try {
        const unfollowedUser = await User.findById(req.params.profileid).exec();
        const currentUser = await User.findById(req.body.user).exec();

        const newFollowers = unfollowedUser.followers.filter((follower) => {
            return follower.toString() !== req.body.user;
        })

        const newFollowing = currentUser.following.filter((user) => {
            return user.toString() !== req.params.profileid
        })

        unfollowedUser.followers = newFollowers;
        currentUser.following = newFollowing;

        await unfollowedUser.save();
        await currentUser.save();

        res.status(200).json({ currentUser });
    } catch (err) {
        return next(err);
    }
}

exports.uploadProfilePicture = async (req, res, next) => {    
    const file = req.file
    const id = req.params.profileid // by making the key the profileid, when user uploads new profile picture, it automatically overwrites existing one
    const fileBuffer = await sharp(file.buffer).resize({ height: 180, width: 180, fit: 'contain' }).toBuffer();

    await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: id,
        Body: fileBuffer,
        ContentType: file.mimetype,
    }));

    await User.findByIdAndUpdate(id, { // update profile to set picture boolean property to true
        profileImage: true
    });

    const imageUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: id,
        }),
        { expiresIn: 60} // 60 seconds
    );
    
    res.status(200).json({ imageUrl, message: 'Profile picture saved!' });
}