const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://franklin:M3tb9qnJ5Z5t16z0@clusterprueba.edp8f8d.mongodb.net/?retryWrites=true&w=majority'
        );
        console.log(
            'Connection successfully established with the my_blog database'
        );
    } catch (error) {
        console.log(error);
        throw new Error(
            'A connection to the database my_blog could not be established.'
        );
    }
};

module.exports = { connection };
