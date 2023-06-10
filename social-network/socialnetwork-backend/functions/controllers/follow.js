const { ObjectId } = require('mongodb');

// Import model
const Follow = require('../models/follow');
const User = require('../models/follow');

// Import Service
const followService = require('../services/followService');

// Import dependencies
const mongoosePagination = require('mongoose-pagination');

// Valid end points
const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: 'Mensaje enviado desde: controllers/follow.js',
    });
};

// Save a follow
const saveFollowUser = (req, res) => {
    // Get data from the body
    const params = req.body;

    // Get user's id
    const identity = req.user;

    // Create an object with follow model
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed,
    });

    // Save into data base
    userToFollow.save((error, followStored) => {
        if (error || !followStored) {
            return res.status(500).send({
                status: 'error',
                message: 'User cannot be followed!.',
            });
        }
        return res.status(200).send({
            status: 'success',
            identity: req.user,
            follow: followStored,
        });
    });
};

// Unfollow user
const unfollowUser = (req, res) => {
    // Get the user's Id
    const userId = new ObjectId(req.user.id);
    console.log(userId);

    // Get the user's Id of the user I follow and I want to unfollow.
    const followedId = new ObjectId(req.params.id);
    console.log(followedId);

    // Find users to meet the criteria.
    Follow.find({
        // prettier-ignore
        'user': userId,
        'followed': followedId,
        // prettier-ignore
    }).remove((error, followDeleted) => {
        if (error || !followDeleted) {
            return res.status(500).send({
                status: 'error',
                message: 'User cannot be unfollowed!.',
            });
        }
        return res.status(200).send({
            status: 'success',
            message: 'Follow deleted correctly!.',
        });
    });
};

// Get the list of users that are following the logged in user
const followingUser = (req, res) => {
    // Get user Id (logged in)
    let userId = new ObjectId(req.user.id);

    // Check if I get the Id as a parameter in the URL
    if (req.params.id) {
        userId = new ObjectId(req.params.id);
    }

    // Check if I get the page number
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    // Users per page I want to show you
    const itemsPerPage = 5;

    // Find a follow, get all data and paginate with mongoose paginate
    Follow.find({ user: userId })
        .populate('user followed', '-password -role -__v -email')
        .paginate(page, itemsPerPage, async (error, follows, total) => {
            // Get an array with Ids with users I follow and I follow back
            let followUserIds = await followService.followUserIds(req.user.id);
            return res.status(200).send({
                status: 'success',
                message: 'List of users that I follow!.',
                follows,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers,
            });
        });
};

// List of users who follow other user, (I am followed, my followers)
const followersUser = (req, res) => {
    // Get the user id of the user logged in
    let userId = req.user.id;

    // Check if the Id is in the URL params
    if (req.params.id) {
        userId = req.params.id;
    }

    // Check if I get the page or not.
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    // Users per page
    const itemsPerPage = 5;

    Follow.find({ followed: userId })
        .populate('user', '-password -role -__v -email')
        .paginate(page, itemsPerPage, async (error, follows, total) => {
            let followUserIds = await followService.followUserIds(req.user.id);

            return res.status(200).send({
                status: 'success',
                message: 'List of users that follow me!.',
                follows,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers,
            });
        });
};

// Exports actions
module.exports = {
    pruebaFollow,
    saveFollowUser,
    unfollowUser,
    followingUser,
    followersUser,
};
