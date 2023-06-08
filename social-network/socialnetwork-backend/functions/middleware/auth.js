const jwt = require('jwt-simple');
const moment = require('moment');

// Import secret password
const libjwt = require('../services/jwt');
const secret = libjwt.secret;

//* Authenication Middleware
exports.auth = (req, res, next) => {
    // Check the authorization header
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: 'error',
            message: 'The request does not have the authorization header',
        });
    }

    // Clean token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // Decrypt the token
    try {
        let payload = jwt.decode(token, secret);

        // Check token expiration
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: 'error',
                message: 'Token expired',
            });
        }

        // Add user data to request
        req.user = payload;
    } catch (error) {
        return res.status(404).send({
            status: 'error',
            message: 'Invalid Token',
            error,
        });
    }

    // Go to the next action
    next();
};
