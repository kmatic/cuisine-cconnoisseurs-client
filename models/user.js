const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);