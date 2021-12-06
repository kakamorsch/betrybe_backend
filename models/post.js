const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')
const PostSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
    userId: {type: String, required: true},
    published: { type: Date, default: Date.now , required: true},
    updated: { type: Date, default: Date.now, required: true },
    user: {type: Object}
});

PostSchema.pre('save', async function(next) {
	let post = this;
    post.user =  await User.findOne({_id: post.userId})
	return next();
});

module.exports = mongoose.model('Post', PostSchema);
