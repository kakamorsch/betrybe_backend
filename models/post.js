const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
    userId: {type: String, required: true},
    published: { type: Date, default: Date.now , required: true},
    updated: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('Post', PostSchema);
