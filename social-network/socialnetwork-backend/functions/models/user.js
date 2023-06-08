const { Schema, model } = require('mongoose');
const UserSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    nick: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: 'role_user',
    },
    image: {
        type: String,
        default:
            'https://res.cloudinary.com/dccsb07gm/image/upload/v1686226470/social/default_snquiq.jpg',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('User', UserSchema);
