const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    author: { type: String, required: true },
});

module.exports = mongoose.model('Post', postSchema);