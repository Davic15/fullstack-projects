const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user');
const check = require('../middleware/auth');

// Test Routes
router.get('/test_user', check.auth, UserController.testUser);
router.get('/test', (req, res) => {
    return res.status(200).json({
        id: 1,
        name: 'David',
        surname: 'Macias',
    });
});

// Valid Routes - No Test
router.post('/register', UserController.registerUser);

module.exports = router;
