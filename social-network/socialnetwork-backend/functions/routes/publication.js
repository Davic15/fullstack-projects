const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const PublicationController = require('../controllers/publication');
const check = require('../middleware/auth');

// Configure Cloudinary and Multer
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'social/publication',
    },
});

const upload = multer({ storage: storage });

// Valid end points
router.get('/prueba-publication', PublicationController.pruebaPublication);
router.post('/save', check.auth, PublicationController.savePublication);
router.get('/detail/:id', check.auth, PublicationController.detailPublication);
router.delete(
    '/remove/:id',
    check.auth,
    PublicationController.removePublication
);
router.get(
    '/user/:id/:page?',
    check.auth,
    PublicationController.userPublication
);
router.post(
    '/upload/:id',
    [check.auth, upload.single('picture')],
    PublicationController.uploadImagePublication
);
router.get('/media/:id', PublicationController.getImagePublication);
router.get('/feed/:page?', check.auth, PublicationController.feedPublication);

module.exports = router;
