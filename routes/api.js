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
router.get('/posts/:profileid', 
    passport.authenticate('jwt', {session: false}),
    postController.getPosts
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
router.get('/posts/profile/:profileid',
    passport.authenticate('jwt', {session: false}),
    postController.getProfilePosts
);

// COMMENTS

// create a comment on a post
router.post(
    '/posts/:postid/comments',
    passport.authenticate('jwt', {session: false}),
    commentController.createComment
);

// get all comments on a post
router.get('/posts/:postid/comments', 
    passport.authenticate('jwt', {session: false}),
    commentController.getComments
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
router.get('/users',
    passport.authenticate('jwt', {session: false}),
    profileController.getUsers
);

// get user profile
router.get('/profile/:profileid',
    passport.authenticate('jwt', {session: false}), 
    profileController.getProfile
);

// update user profile
router.patch('/profile/:profileid', 
    passport.authenticate('jwt', {session: false}),
    profileController.updateUser
);

// follow user profile
router.patch('/profile/:profileid/follow',
    passport.authenticate('jwt', {session: false}),
    profileController.follow
);

// unfollow user profile
router.patch('/profile/:profileid/unfollow',
    passport.authenticate('jwt', {session: false}),
    profileController.unfollow
);

// update user profile picture
router.post(
    '/profile/:profileid/image',
    passport.authenticate('jwt', {session: false}),
    upload.single('image'),
    profileController.uploadProfilePicture
);

module.exports = router;