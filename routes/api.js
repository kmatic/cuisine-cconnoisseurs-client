const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');

// import controllers
const commentController = require('../controllers/commentController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController')

// multer setup 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// get / redirect to /posts
router.get('/', (req, res) => {
    res.redirect('/api/posts');
});

//POSTS
// create a post
router.post(
    '/posts',
    passport.authenticate('jwt', {session: false}),
    postController.createPost
);

// get all user and followed user posts
router.get('/posts/:profileid', postController.getPosts);

// get specific  post
// router.get('/posts/:postid', postController.getPost);

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

// like a post
router.patch(
    '/posts/:postid/like',
    passport.authenticate('jwt', {session: false}),
    postController.likePost
)

// get users posts for their profile
router.get('/posts/profile/:profileid', postController.getProfilePosts);

// COMMENTS

// create a comment on a post
router.post(
    '/posts/:postid/comments',
    passport.authenticate('jwt', {session: false}),
    commentController.createComment
);

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

// USER AUTH STUFF

// signup user
router.post('/signup', userController.signup); 

// login user
router.post('/login', userController.login);

// logout user
router.post('/logout', userController.logout);

// USER PROFILE STUFF

// get all users
router.get('/users', profileController.getUsers)

// get user profile
router.get('/profile/:profileid', profileController.getProfile)

// update user profile
router.patch('/profile/:profileid', profileController.updateUser)

// follow user profile
router.patch('/profile/:profileid/follow', profileController.follow)

// unfollow user profile
router.patch('/profile/:profileid/unfollow', profileController.unfollow);

// update user profile picture
router.post(
    '/profile/:profileid/image',
    upload.single('image'),
    profileController.uploadProfilePicture
);

module.exports = router;