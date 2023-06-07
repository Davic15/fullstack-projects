const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { validateArticle } = require('../helpers/validation');
const Article = require('../models/article');

// Valid end points

// Create a new Post.
const createArticle = (req, res) => {
    // Get parameters by post to save them
    let params = req.body;

    // Validate data
    try {
        validateArticle(params);
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing data',
            params: params,
        });
    }

    // Create object
    const article = new Article(params);

    // Set values to the object based in the model (manual or automatic).
    // article.title = params.title

    // Save article in the database
    article.save((error, articleSaved) => {
        if (error || !articleSaved) {
            return res.status(400).json({
                status: 'error',
                message: 'The article was not saved!.',
            });
        }

        // Return result
        return res.status(200).json({
            status: 'success',
            message: 'Article saved!.',
            article: articleSaved,
        });
    });
};

// List all Articles all, and with a parameter only returns 3.
const listArticles = (req, res) => {
    let query = Article.find({});
    // Get an optional parameter to display up to 3 articles
    if (req.params.latest) {
        query.limit(3);
    }

    query.sort({ date: -1 }).exec((error, articles) => {
        // Error if there are no articles
        if (error || !articles) {
            return res.status(400).json({
                status: 'error',
                message: 'No articles were found!.',
            });
        }

        // Return results
        return res.status(200).send({
            status: 'success',
            counter: articles.length,
            articles: articles,
            message: 'Article listed!.',
        });
    });
};

// Get a single article by ID.
const singleArticle = (req, res) => {
    // Get the ID from the URL
    let id = new ObjectId(req.params.id);

    // Search a single article
    Article.findById(id, (error, article) => {
        // Error if the ID doesn't exist
        if (error || !article) {
            return res.status(404).json({
                status: 'error',
                message: 'No article was found!.',
                id: id,
            });
        }

        // Return Result
        return res.status(200).json({
            status: 'success',
            article: article,
            message: 'Article found!.',
        });
    });
};

// Delete an article by ID.
const deleteArticle = (req, res) => {
    let articleId = new ObjectId(req.params.id);
    Article.findOneAndDelete({ _id: articleId }, (error, articleDeleted) => {
        if (error || !articleDeleted) {
            return res.status(500).json({
                status: 'error',
                message: 'Article was not deleted!.',
            });
        }
        return res.status(200).json({
            status: 'success',
            article: articleDeleted,
            message: 'Article deleted!.',
        });
    });
};

// Edit an article by ID.
const editArticle = (req, res) => {
    // Get the article id to modify it
    let articleId = new ObjectId(req.params.id);

    // Get body data
    let params = req.body;

    // Validate data
    try {
        validateArticle(params);
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing data!.',
        });
    }

    // Find and Update the article
    Article.findOneAndUpdate(
        { _id: articleId },
        req.body,
        { new: true },
        (error, articleUpdated) => {
            if (error || !articleUpdated) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Article was not updated!.',
                });
            }
            // Return response
            return res.status(200).json({
                status: 'success',
                article: articleUpdated,
            });
        }
    );
};

// Upload an Image for an article by ID (Cloudinary).
const uploadImageArticle = async (req, res) => {
    // Setting multer

    // Get image file
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: 'error',
            message: 'Wrong Request!.',
        });
    }

    // File name
    let file = req.file.originalname;

    // File extension
    let file_split = file.split('.');
    let extension = file_split[1];

    // Check correct extension
    if (
        extension != 'png' &&
        extension != 'jpg' &&
        extension != 'jpeg' &&
        extension != 'gif'
    ) {
        // Delete file and send a response
        return res.status(400).json({
            status: 'error',
            message: 'Image not valid!.',
        });
    } else {
        // Get article Id to modify
        let articleId = new ObjectId(req.params.id);

        // Find and update that article
        Article.findOneAndUpdate(
            { _id: articleId },
            { image: req.file.path },
            { new: true },
            (error, articleUpdated) => {
                if (error || !articleUpdated) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Article not updated!.',
                    });
                }
                // Return response
                return res.status(200).json({
                    status: 'success',
                    article: articleUpdated,
                    file: req.file,
                });
            }
        );
    }
};

// Get and Image by Id. It is not working anymore, because the images are not saved in the backend. Now the images are saved in Cloudinary.
const getImage = (req, res) => {
    let file = req.params.file;
    console.log(file);
    let imagePath = path.join(
        __dirname,
        '..',
        '..',
        'images',
        'articles',
        file
    );

    fs.stat(imagePath, (error, existFile) => {
        console.log('asdasd' + imagePath);
        if (existFile) {
            //return res.sendFile(imagePath);
            console.log('ex' + path.resolve(imagePath));
            return res.sendFile(path.resolve(imagePath));
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Image does not exist!.',
                imagePath,
                file,
                existFile,
            });
        }
    });
};

// Search and Article by ID.
const searchArticle = (req, res) => {
    // Get search string
    let search = req.params.search;

    // Find OR
    Article.find({
        // prettier-ignore
        '$or': [
            { 'title': { '$regex': search, '$options': 'i' } },
            { 'content': { '$regex': search, '$options': 'i' } },
        ],
        // pretier-ignore
    })
        .sort({ date: -1 })
        .exec((error, articlesFound) => {
            if (error || !articlesFound || articlesFound.length <= 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No articles were found!.',
                });
            }
            return res.status(200).json({
                status: 'success',
                articles: articlesFound,
            });
        });
};

module.exports = {
    createArticle,
    listArticles,
    singleArticle,
    deleteArticle,
    editArticle,
    uploadImageArticle,
    getImage,
    searchArticle,
};
