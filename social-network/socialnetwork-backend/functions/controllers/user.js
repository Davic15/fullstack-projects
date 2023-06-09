const bcrypt = require('bcrypt');
const mongoosePagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('../models/user');
const Follow = require('../models/follow');

// Import services
const jwt = require('../services/jwt');
const followService = require('../services/followService');
const validate = require('../helpers/validate');

// Test end point
const testUser = (req, res) => {
    return res.status(200).send({
        message: 'Message ok',
        user: req.user,
    });
};

// Register a new user
const registerUser = (req, res) => {
    // Get data
    let params = req.body;

    // Validate data
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing data!.',
        });
    }

    // Advance validation
    try {
        validate(params);
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation fail, data is not correct!.',
        });
    }

    // Validate if the new user exists or not
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() },
        ],
    }).exec(async (error, users) => {
        if (error) {
            return res.status(500).json({
                status: 'error',
                message: `There is an error in the user's query!.`,
            });
        }
        if (users && users.length >= 1) {
            return res.status(200).send({
                status: 'success',
                message: 'User already existe in the Database!.',
            });
        }

        // Encrypt password
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Create user object
        let userToSave = new User(params);

        // Save new user in the database
        userToSave.save((error, userStored) => {
            if (error || !userStored) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error saving the new user!.',
                });
            }
            // Add the new user
            userStored.toObject();
            delete userStored.password;
            delete userStored.role;

            //return result
            return res.status(200).json({
                status: 'success',
                message: 'User registered successfuly!.',
                user: userStored,
            });
        });
    });
};

const loginUser = (req, res) => {
    // Get data from body
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: 'error',
            message: 'Missing email and/or password!.',
        });
    }

    // Search if the user existe in the Database.
    User.findOne({ email: params.email }).exec((error, user) => {
        if (error || !user) {
            return res
                .status(404)
                .send({ status: 'error', message: 'User not found!.' });
        }

        // Check password
        const pwd = bcrypt.compareSync(params.password, user.password);
        if (!pwd) {
            return res.status(400).send({
                status: 'error',
                message: 'Login credentials are not ok, please retry again!.',
            });
        }

        // Get Token
        const token = jwt.createToken(user);

        // Return user Data
        return res.status(200).send({
            status: 'success',
            message: 'Logged in successfully!.',
            user: {
                id: user._id,
                name: user.name,
                nick: user.nick,
            },
            token,
        });
    });
};

const profileUser = (req, res) => {
    // Get data (ID) from the url
    const id = req.params.id;

    // Get user data by ID.
    User.findById(id)
        .select({ password: 0, role: 0 })
        .exec(async (error, userProfile) => {
            if (error || !userProfile) {
                return res.status(404).send({
                    status: 'error',
                    message: 'User does not exist!.',
                });
            }

            // Get information about following
            const followInfo = await followService.followThisUser(
                req.user.id,
                id
            );

            //Return data
            return res.status(200).send({
                status: 'success',
                user: userProfile,
                following: followInfo.following,
                follower: followInfo.follower,
            });
        });
};

const listUser = (req, res) => {
    // Check the current page
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    page = parseInt(page);

    // Use mongoose paginate
    let itemsPerPage = 5;

    User.find()
        .select('-password -email -role -__v')
        .sort('_id')
        .paginate(page, itemsPerPage, async (error, users, total) => {
            if (error || !users) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No users found!.',
                    error,
                });
            }

            // Get and arrar of users that follow me and I follow then back
            let followUserIds = await followService.followUserIds(req.user.id);

            // Return all data
            return res.status(200).send({
                status: 'success',
                users,
                page,
                itemsPerPage,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers,
            });
        });
};

const updateUser = (req, res) => {
    // Get data from the body to update
    let userIdentity = req.user;
    let userToUpdate = req.body;

    // Delete some information before update
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    // Check if the user exist or not
    User.find({
        $or: [
            { email: userToUpdate.email.toLowerCase() },
            { nick: userToUpdate.nick.toLowerCase() },
        ],
    }).exec(async (error, users) => {
        if (error) {
            return res.status(500).json({
                status: 'error',
                message: `There is an error in the user's query!.`,
            });
        }
        let userIsSet = false;
        users.forEach((user) => {
            if (user && user._id != userIdentity.id) {
                userIsSet = true;
            }
        });
        if (userIsSet) {
            return res.status(200).send({
                status: 'success',
                message: 'User already exist!.',
            });
        }

        // Encrypt password
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        } else {
            delete userToUpdate.password;
        }

        // Find and update
        try {
            let userUpdated = await User.findByIdAndUpdate(
                { _id: userIdentity.id },
                userToUpdate,
                { new: true }
            );
            if (!userUpdated) {
                return res.status(400).json({
                    status: 'error',
                    message: 'There is an error, user cannot be updated!',
                });
            }

            // Return response
            return res.status(200).send({
                status: 'success',
                message: 'Update user!.',
                user: userUpdated,
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error update user!.',
            });
        }
    });
};

const uploadPhotoUser = (req, res) => {};

module.exports = {
    testUser,
    registerUser,
    loginUser,
    profileUser,
    listUser,
    updateUser,
    uploadPhotoUser,
};
