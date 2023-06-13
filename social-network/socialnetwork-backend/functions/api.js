const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const userRoutes = require('./routes/user');
const publicationRoutes = require('./routes/publication');
const followRoutes = require('./routes/follow');

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
/*
app.use((req, res, next) => {
    //* * all domains or specific domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});*/
/*app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});*/

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
