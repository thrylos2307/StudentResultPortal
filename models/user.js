const mongoose = require('mongoose');
const user = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    uid: {
        type: Number,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
    },
    isVoter: {
        type: Boolean,
        required: true,
        default: true
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});
// Models are responsible for creating and reading documents from the underlying MongoDB database
// An instance of model is called a document
const User = mongoose.model('User', user);
module.exports = User;