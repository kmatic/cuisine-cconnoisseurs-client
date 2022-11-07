const express = require('express');
const router = express.Router();

// import controllers
const commentController = require('../controllers/commentController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

// get / redirect to /posts
router.get('/', (req, res) => {
    res.redirect('/api/posts');
});

// Map to CRUD 

//POSTS

// create a post
router.post(
    '/posts',
    passport.authenticate('jwt', {session: false}),
    postController.createPost
);

// get all posts
router.get('/posts', postController.getPosts);

// get specific post
router.get('/posts/:postid', postController.getPost);

// update specific post 
router.put(
    '/posts/:postid',
    passport.authenticate('jwt', {session: false}),
    postController.updatePost
);

// delete specific post
router.delete(
    '/posts/:postid',
    passport.authenticate('jwt', {session: false}),
    postController.deletePost
);

// COMMENTS

// create a comment on a post
router.post('/posts/:postid/comments', commentController.createComment);

// get all comments on a post
router.get('/posts/:postid/comments', commentController.getComments);

// get a specific comment on a post
router.get('/posts/:postid/comments/:commentid', commentController.getComment);

// update a comment 
router.put(
    '/posts/:postid/comments/:commentid',
    passport.authenticate('jwt', {session: false}),
    commentController.updateComment
);

// delete a comment
router.delete(
    '/posts/:postid/comments/:commentid',
    passport.authenticate('jwt', {session: false}),
    commentController.deleteComment
);

// USER

// signup user
// router.post('/signup', userController.signup); 

// login user
router.post('/login', userController.login);

// logout user
router.post('/logout', userController.logout);

module.exports = router;