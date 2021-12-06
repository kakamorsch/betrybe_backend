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
		res.status(500).send({ error: 'erro na consulta de post', err });
	}
});

router.get('/post', auth, async (req, res) => {
	try{
		let posts = await Post.find({});
		return res.status(200).send(posts);
	} catch(err) {
		res.status(500).send({ error: 'erro na consulta de post', err });
	}
});

router.get('/post/:id', auth, async (req, res) => {
	const { id } = req.params;
	try{
		let posts = await Post.findOne({_id:id});
		return res.status(200).send(posts);
		
	} catch(err){
		res.status(500).send({ error: 'erro na consulta de post', err });
	}
});

router.put('/post/:id', auth, async (req, res) => {
	const { id } = req.params;
	const update = { title: req.body.title, content: req.body.content }
	try{
		const userId = res.locals.authData;
		let post = await Post.findOne({_id:id});
		if(post.userId!==userId) return res.status(401).send({ error: 'Usuário não autorizado'});
		post = await Post.findOneAndUpdate({_id:id}, update);
		update.userId = userId
		return res.status(200).send(update);
	} catch(err){
		res.status(500).send({ error: 'erro na consulta de post', err });
	}
});
router.delete('/post/:id', auth, async (req, res) => {
	const {id} = req.params;
	try {
		const userId = res.locals.authData;
		let post = await Post.findOne({_id:id});
		if(post.userId!==userId) return res.status(401).send({ error: 'Usuário não autorizado'});

		await Post.deleteOne({ _id: id }).then(() => {
			return res.status(204).send();
		});
	} catch (err) {
		return res.status(500).send({ error: 'erro ao remover post', err });
	}
});
module.exports = router;
