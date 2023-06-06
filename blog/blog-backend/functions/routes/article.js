const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const ArticleController = require('../controller/article');

const router = express.Router();
/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb(null, '../../../blog-backend/images/articles/');
        //cb(null, path.join(__dirname, '../../images/articles'));
        cb(
            null,
            path.normalize(
                path.join(__dirname, '..', '..', 'images', 'articles')
            )
        );
    },
    filename: function (req, file, cb) {
        cb(
            null,
            new Date().toISOString().replace(/:/g, '-') + file.originalname
        );
    },
});

const uploads = multer({ storage: storage });
*/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog'
    }
})

const upload = multer({ storage: storage });



// Fake Routes
/*router.get('/first', ArticleController.firstTry);
router.get('/course', ArticleController.course);*/

// Valid Routes
router.post('/create', ArticleController.createArticle);
router.get('/articles/:latest?', ArticleController.listArticles);
router.get('/article/:id', ArticleController.singleArticle);
router.delete('/article/:id', ArticleController.deleteArticle);
router.put('/article/:id', ArticleController.editArticle);
router.post('/upload-image/:id', upload.single('picture'), ArticleController.uploadImageArticle)
/*router.post(
    '/upload-image/:id',
    //uploads.single('file0'),
    memoryStorage.
    ArticleController.uploadImageArticle
);*/
router.get('/image/:file', ArticleController.getImage);
router.get('/search/:search', ArticleController.searchArticle);

module.exports = router;

/*const express = require('express');
const connection = require('../../src/database/connection');
const getActionsModel = require('../models/article');
const router = express.Router();

const incrementAction = async (req, res, url, actionName) => {
    await connection();

    const MongooseModelAction = await getActionsModel();

    if (!MongooseModelAction) {
        res.status(500).send('Action not defined');
        return;
    }

    try {
        const action = await MongooseModelAction.findOneAndUpdate(
            { url },
            { $inc: { [actionName]: 1 } },
            { upsert: true, new: true }
        );

        res.status(200).json({ [actionName]: action[actionName] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

router.get('/', (req, res) => {
    res.status(200).json({ test: 'Hello' });
});

router.get('/like', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        res.status(400).send('Missing url parameter');
    } else {
        await incrementAction(req, res, url, 'like');
    }
});

router.get('/probando', (req, res) => {
    console.log('Se ha ejecutado el endpoint probando');

    return res.status(200).json([
        {
            curso: 'Master en React',
            autor: 'Víctor Robles WEB',
            url: 'victorroblesweb.es/master-react',
        },
        {
            curso: 'Master en React',
            autor: 'Víctor Robles WEB',
            url: 'victorroblesweb.es/master-react',
        },
    ]);
});

module.exports = router;*/
