const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

// create post logic
exports.createPost = [
    body('restaurant', 'Restaurant required').trim().isLength({ min: 1 }).escape(),
    body('rating', 'Maximum of 5 stars').isFloat({ min: 0, max: 5}).escape(),
    // body('description', 'yeet').optional().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body,
            });
        }
        const post = new Post({
            restaurant: req.body.restaurant,
            rating: req.body.rating,
            description: req.body.description,
            user: req.body.user,
        });
        post.save((err) => {
            if (err) return next(err);
            res.status(200).json({ msg: 'Post created' });
        });
    }
];

// get posts logic
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ timestamp: -1 }).populate('user', '_id username').exec();
        if (!posts) {
            return res.status(400).json({ error: 'Posts not found' });
        }
        res.status(200).json({ posts });
    } catch (err) {
        return next(err);
    }
}

// get post logic
// exports.getPost = async (req, res, next) => {
//     try {
//         const post = await Post.findById(req.params.postid).exec();
//         if (!post) {
//             return res.status(400).json({ error: 'Post not found' });
//         }
//         res.status(200).json({ post });
//     } catch (err) {
//         return next(err);
//     }
// }

// update post logic
exports.updatePost = [
    body('restaurant', 'Restaurant required').trim().isLength({ min: 1 }).escape(),
    body('rating', 'Maximum of 5 stars').isFloat({ min: 0, max: 5}).escape(),
    body('description', 'yeet').optional().escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body,
            });
        }
        const post = new Post({
            restaurant: req.body.restaurant,
            rating: req.body.rating,
            description: req.body.description,
            user: req.body.user,
            _id: req.params.postid
        });
        try {
            const updatedPost = await Post.findByIdAndUpdate(req.params.postid, post, {}).exec();
            if(!updatedPost) {
                return res.status(400).json({ error: 'Error updating post' });
            }
            res.status(200).json({ msg: 'Post updated' });
        } catch (err) {
            return next(err);
        }
    }
];

// delete post logic
exports.deletePost = async (req, res, next) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postid).exec();
        if (!deletedPost) {
            return res.status(400).json({ error: 'Error deleting post' });
        }
        res.status(200).json({ msg: 'Post deleted', deletedPost });
    } catch (err) {
        return next(err);
    }
}

exports.likePost = async (req, res, next) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postid, {
            likes: req.body.likes,
        }, {new: true}).populate('user', '_id username').exec()
        res.status(200).json({ post: updatedPost })
    } catch (err) {
        return next(err);
    }
}

exports.getProfilePosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ user: req.params.profileid }).sort({ timestamp: -1 }).exec();
        if (!posts) {
            return res.status(400).json({ error: 'Posts not found' });
        }
        res.status(200).json({ posts });
    } catch (err) {
        return next(err);
    }
}