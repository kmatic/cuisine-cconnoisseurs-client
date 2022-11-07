const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    name: { type: String, required: true },
    post: { type: Schema.ObjectId, ref: 'Post' },
});

module.exports = mongoose.model('Comment', commentSchema);