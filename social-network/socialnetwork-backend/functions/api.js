const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

require('dotenv').config();
const connection = require('../src/database/connection');

// Welcome message to the social network
console.log('API NODE for a social network started!.');

// Database connection
connection();

// Server Node creation
const app = express();

// Cors configurarion
app.use(cors());

const userRoutes = require('./routes/user');
const publicationRoutes = require('./routes/publication');
const followRoutes = require('./routes/follow');

app.use(function (req, res, next) {
    const allowedHosts = [
        'socialnetwork-backend.netlify.app',
        'localhost:8888',
    ];
    const host = req.headers.host;
    console.log(`host: ${host}`);

    if (allowedHosts.includes(host)) {
        next();
    } else {
        return res.status(405).send('Host Not Allowed');
    }
});

// Change body data to JavaScript object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Routes
app.use('/.netlify/functions/api/user', userRoutes);
app.use('/.netlify/functions/api/publication', publicationRoutes);
app.use('/.netlify/functions/api/follow', followRoutes);

module.exports.handler = serverless(app);
