const Comment = require('../models/comment');
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

// create comment logic
exports.createComment = [
    body('text', 'Text required').trim().isLength({ min: 1}).escape(),
    body('name', 'Name required').trim().isLength({ min: 1}).escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body,
            });
        }
        const comment = new Comment({
            text: req.body.text,
            name: req.body.name,
            post: req.params.postid
        });
        try {
            const post = await Post.findById(req.params.postid).exec();
            if (!post) {
                return res.status(400).json({ error: 'Cannot comment on non-existing post' });
            }
            await comment.save();
            res.status(200).json({ msg: 'comment posted', comment });
        } catch (err) {
            return next(err);
        }
    }
];

// get comments logic
exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.postid }).exec();
        if (!comments) {
            return res.status(400).json({ error: 'Comments not found' });
        }
        res.status(200).json({ comments });
    } catch (err) {
        return next(err);
    }
};

// get single comment logic
exports.getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentid).exec();
        if (!comment) {
            return res.status(400).json({ error: 'Comment not found' });
        }
        res.status(200).json({ comment });
    } catch (err) {
        return next(err);
    }
}

// update single comment logic
exports.updateComment = [
    body('text', 'Text required').trim().isLength({ min: 1}).escape(),
    body('name', 'Name required').trim().isLength({ min: 1}).escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body
            });
        }
        const comment = new Comment({
            text: req.body.text,
            name: req.body.name,
            post: req.params.postid,
            _id: req.params.commentid
        });
        try {
            const updatedComment = await Comment.findByIdAndUpdate(req.params.commentid, comment).exec();
            if (!updatedComment) {
                return res.status(400).json({ error: 'Error updating comment' });
            }
            res.status(200).json({ msg: 'Comment updated' });
        } catch (err) {
            return next(err);
        }
    }
];

// delete comment logic
exports.deleteComment = async (req, res, next) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentid).exec();
        if (!deletedComment) {
            return res.status(400).json({ error: 'Erroor deleting comment' });
        }
        res.status(200).json({ msg: 'Comment deleted', deletedComment });
    } catch (err) {
        return next(err);
    }
}