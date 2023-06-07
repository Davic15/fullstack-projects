const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const ArticleController = require('../controller/article');

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog',
    },
});

const upload = multer({ storage: storage });

// Valid Routes
router.post('/create', ArticleController.createArticle);
router.get('/articles/:latest?', ArticleController.listArticles);
router.get('/article/:id', ArticleController.singleArticle);
router.delete('/article/:id', ArticleController.deleteArticle);
router.put('/article/:id', ArticleController.editArticle);
router.post(
    '/upload-image/:id',
    upload.single('picture'),
    ArticleController.uploadImageArticle
);
router.get('/image/:file', ArticleController.getImage);
router.get('/search/:search', ArticleController.searchArticle);

module.exports = router;
