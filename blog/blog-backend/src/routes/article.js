const express = require('express');
const multer = require('multer');
const ArticleController = require('../controller/article');

const router = express.Router();

router.get('/curso', ArticleController.curso);
router.get('/prueba', ArticleController.prueba);

module.exports = router;
