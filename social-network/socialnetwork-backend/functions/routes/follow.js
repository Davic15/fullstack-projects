const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow');
const check = require('../middleware/auth');

// Valid end points
router.get('/prueba-follow', FollowController.pruebaFollow);
router.post('/save', check.auth, FollowController.saveFollowUser);
router.delete('/unfollow/:id', check.auth, FollowController.unfollowUser);
router.get(
    '/following/:id?/:page?',
    check.auth,
    FollowController.followingUser
);
router.get(
    '/followers/:id?/:page?',
    check.auth,
    FollowController.followersUser
);

module.exports = router;
