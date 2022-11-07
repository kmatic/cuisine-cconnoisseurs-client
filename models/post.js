const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    restaurant: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String },
    timestamp: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref:' User' }]
});

module.exports = mongoose.model('Post', postSchema);