const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterprueba.edp8f8d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
        );
        console.log('Connected to the database: my_blog');
    } catch (error) {
        console.log(error);
        throw new Error(
            'Failed to establish a connection to the database: my_blog'
        );
    }
};

module.exports = {
    connection,
};
