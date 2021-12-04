const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
	displayName: { type: String, required: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true, select: false },
	image: {
		type: String,
		default:
			'https://image.shutterstock.com/z/stock-vector-man-icon-vector-1040084344.jpg',
	},
});

UserSchema.pre('save', async function (next) {
	let user = this;
	if (!user.isModified('password')) return next();

	user.password = await bcrypt.hash(user.password, 10);

	return next();
});

module.exports = mongoose.model('User', UserSchema);
