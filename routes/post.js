const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const auth = require('../middlewares/auth');

router.post('/post', auth, async (req, res) => {
	const { title, content } = req.body;
	if (!title) return res.status(400).send({ error: 'title is required' });
	if (!content) return res.status(400).send({ error: 'content is required' });
	try {
		const fields = {
			title,
			content,
			userId: res.locals.authData,
		};
		const post = await Post.create(fields);
		return res
			.status(201)
			.send({ content: post.content, title: post.title, userId: post.userId });
	} catch (err) {
		res.status(500).send({ error: 'erro na consulta de usuario', err });
	}
});

router.get('/post', auth, async (req, res) => {
	try {
		const posts = await Post.find({});
		return res.send(posts);
	} catch (err) {
		res.status(500).send({ error: 'post n encontrado', err });
	}
});
router.get('/post/:id', auth, async (req, res) => {
	try {
		const { id } = req.params;
		const posts = await Post.find({ _id: id });
		return res.send(posts);
	} catch (err) {
		res.status(500).send({ error: 'post n encontrado', err });
	}
});
router.delete('/post/:id', auth, async (req, res) => {
	const { id } = req.params;
	try {
		await Post.deleteOne({ _id: id }).then(() => {
			return res.status(204).send();
		});
	} catch (err) {
		req.body = 'error: ' + err;
	}
});

module.exports = router;
