const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

// create post logic
exports.createPost = [
    body('title', 'Title required').trim().isLength({ min: 1 }).escape(),
    body('text', 'Text required').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body,
            });
        }
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            author: req.body.author,
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
        const posts = await Post.find().sort({ timestamp: -1 }).exec();
        if (!posts) {
            return res.status(400).json({ error: 'Posts not found' });
        }
        res.status(200).json({ posts });
    } catch (err) {
        return next(err);
    }
}

// get post logic
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postid).exec();
        if (!post) {
            return res.status(400).json({ error: 'Post not found' });
        }
        res.status(200).json({ post });
    } catch (err) {
        return next(err);
    }
}

// update post logic
exports.updatePost = [
    body('title', 'Title required').trim().isLength({ min: 1 }).escape(),
    body('text', 'Text required').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author required').trim().isLength({ min: 1 }).escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body,
            });
        }
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            author: req.body.author,
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