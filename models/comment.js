const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Comment', commentSchema);