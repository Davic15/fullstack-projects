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
            'https://res.cloudinary.com/dccsb07gm/image/upload/v1686093110/blog/default_vouur3.jpg',
    },
});

module.exports = model('Article', ArticleSchema);
