// Import models
const Publication = require('../models/publication');

// Import services
const followService = require('../services/followService');

// Fake endpoint
const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: 'Mensaje enviado desde: controllers/publication.js',
    });
};

// Save a publication
const savePublication = (req, res) => {
    // Get data from the body
    const params = req.body;

    // If there is not data, return an error message
    if (!params.text) {
        return res.status(400).send({
            status: 'error',
            message: 'Type the publication text!.',
        });
    }

    // Create and fill the object model
    let newPublication = new Publication(params);
    newPublication.user = req.user.id;

    // Save the object in the database
    newPublication.save((error, publicationStored) => {
        if (error || !publicationStored) {
            return res.status(400).send({
                status: 'error',
                message: 'Publication was not saved!.',
            });
        }
        return res.status(200).send({
            status: 'success',
            message: 'Publication saved!.',
            publicationStored,
        });
    });
};

// Get a publication
const detailPublication = (req, res) => {
    // Get publication Id from the URL.
    const publicationId = req.params.id;

    // Find the publication by Id
    Publication.findById(publicationId, (error, publicationStored) => {
        if (error || !publicationStored) {
            return res.status(404).send({
                status: 'error',
                message: 'Publication does not exist!.',
            });
        }

        // Return Response
        return res.status(200).send({
            status: 'success',
            message: 'View publication!.',
            publication: publicationStored,
        });
    });
};

// Delete a publication
const removePublication = (req, res) => {
    // Get the Id of the publication to be deleted
    const publicationId = req.params.id;

    // Find and remove by Id

    Publication.find(
        // prettier-ignore
        { 'user': req.user.id, '_id': publicationId }
        // prettier-ignore
    ).remove((error) => {
        if (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Publication was not deleted it!.',
            });
        }

        // Return response
        return res.status(200).send({
            status: 'success',
            message: 'Publication deleted!.',
            publication: publicationId,
        });
    });
};

// List publications of an user
const userPublication = (req, res) => {
    // Get the user Id.
    const userId = req.params.id;

    // Check the page
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    const itemsPerPage = 5;

    // Find, populate, sort and paginate

    Publication.find({ user: userId })
        // prettier-ignore
        .sort('-created_at')
        .populate('user', '-password -__v -role -email')
        // prettier-ignore
        .paginate(page, itemsPerPage, (error, publications, total) => {
            if (error || !publications || publications.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No publication to show!.',
                });
            }

            // Return response
            return res.status(200).send({
                status: 'success',
                message: `User's publications`,
                page,
                total,
                pages: Math.ceil(total / itemsPerPage),
                publications,
            });
        });
};

// Upload publication image
const uploadImagePublication = (req, res) => {
    // Get publication Id
    const publicationId = req.params.id;

    // Get the image file and check if this exists
    if (!req.file) {
        return res.status(404).send({
            status: 'error',
            message: 'Image not found!.',
        });
    }

    // Get the file name
    let image = req.file.originalname;

    // Get file extension
    const imageSplit = image.split('.');
    const extension = imageSplit[1];

    // Check extension
    if (
        extension != 'png' &&
        extension != 'jpg' &&
        extension != 'jpeg' &&
        extension != 'gif'
    ) {
        return res.status(400).send({
            status: 'error',
            message: 'Extension not valid!.',
        });
    }

    // If the extension is good, save in the data base
    Publication.findOneAndUpdate(
        // prettier-ignore
        { 'user': req.user.id, '_id': publicationId},
        { file: req.file.path },
        { new: true },
        // prettier-ignore
        (error, publicationUpdated) => {
            if (error || !publicationUpdated) {
                return res.status(500).send({
                    status: 'error',
                    message: 'The publication image was not uploaded!.'
                })
            }

            // Return response
            return res.status(200).send({
                status: 'success',
                publication: publicationUpdated,
                file: req.file
            })
        }
    );
};

// Get image/files by id
const getImagePublication = (req, res) => {
    // Get parameters from the URL
    const publicationId = req.params.id;

    // Search if the publication exist
    Publication.findById(publicationId, (error, publicationImage) => {
        // Error if the publication doesn't exist
        if (error || !publicationImage) {
            return res.status(404).json({
                status: 'error',
                message: 'Publication was not found!.',
                id: publicationId,
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Publication Image found!.',
            publicationImage: publicationImage.file,
        });
    });
};

// Feed Publication list
const feedPublication = async (req, res) => {
    // Get the page
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    // Post per page
    let itemsPerPage = 5;

    // Get an array with users I follow
    try {
        const myFollows = await followService.followUserIds(req.user.id);

        // Find publications, order, populate and paginate
        const publications = Publication.find({ user: myFollows.following })
            // prettier-ignore
            .populate('user', '-password -role -__v -email')
            .sort('-create_at')
            // prettier-ignore
            .paginate(page, itemsPerPage, (error, publications, total) => {
                if (error || !publications) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'There are not publications to show!.',
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    message: 'Publications Feed!.',
                    following: myFollows.following,
                    total,
                    page,
                    pages: Math.ceil(total / itemsPerPage),
                    publications,
                });
            });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error to get some feeds!.',
        });
    }
};

module.exports = {
    pruebaPublication,
    savePublication,
    detailPublication,
    removePublication,
    userPublication,
    uploadImagePublication,
    getImagePublication,
    feedPublication,
};
