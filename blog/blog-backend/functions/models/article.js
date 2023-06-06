const { Schema, model } = require('mongoose');

const ArticleSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
        default:
            'https://res.cloudinary.com/dccsb07gm/image/upload/v1686070139/blog/default_cawsyb.jpg',
    },
});

module.exports = model('Article', ArticleSchema);
