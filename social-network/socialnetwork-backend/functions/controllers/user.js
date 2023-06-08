const bcrypt = require('bcrypt');
const mongoosePagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('../models/user');

// Import services
const jwt = require('../services/jwt');
//const followService = require('../services/followService');
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

module.exports = {
    testUser,
    registerUser,
};
