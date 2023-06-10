const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const UserController = require('../controllers/user');
const check = require('../middleware/auth');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'social/avatars',
    },
});

// Test Routes
router.get('/test_user', check.auth, UserController.testUser);
router.get('/test', (req, res) => {
    return res.status(200).json({
        id: 1,
        name: 'David',
        surname: 'Macias',
    });
});

const upload = multer({ storage: storage });

// Valid Routes - No Test
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/profile/:id', check.auth, UserController.profileUser);
router.get('/list/:page?', check.auth, UserController.listUser);
router.put('/update', check.auth, UserController.updateUser);
router.post(
    '/upload',
    [check.auth, upload.single('picture')],
    UserController.uploadAvatarUser
);
router.get('/avatar/:user', UserController.displayAvatarUser);
router.get('/counters/:id', check.auth, UserController.countersUser);

module.exports = router;
