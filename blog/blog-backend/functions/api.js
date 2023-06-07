const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

require('dotenv').config();

const { connection } = require('../src/database/connection');

// Routes
const articleRoutes = require('./routes/article');

// App started
console.log('App started');

// Database connection
connection();

const app = express();

// Setting up corse
app.use(cors());

app.use(function (req, res, next) {
    const allowedHosts = ['blog-backend.netlify.app', 'localhost:8888'];
    const host = req.headers.host;
    console.log(`host: ${host}`);

    if (allowedHosts.includes(host)) {
        next();
    } else {
        return res.status(405).send('Host Not Allowed');
    }
});

// Change body to Javascript Object
// Get data with content-type app/json
app.use(express.json());
// Handle data form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/.netlify/functions/api', articleRoutes);

module.exports.handler = serverless(app);
