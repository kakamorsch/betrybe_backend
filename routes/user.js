const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const auth = require('../middlewares/auth');

//aux functions
const createUserToken = (userId) =>
	jwt.sign({ id: userId }, config.jwtToken, {
		expiresIn: config.jwtExpiration,
	});

router.get('/user', auth, async (req, res) => {
	try {
		const users = await User.find({});
		return res.send(users);
	} catch (err) {
		res.status(500).send({ error: 'erro na consulta de usuario', err });
	}
});
router.get('/user/:id', auth, async (req, res) => {
	try {
		const { id } = req.params;
		const users = await User.find({ _id: id });
		return res.send(users);
	} catch (err) {
		res.status(500).send({ error: 'user n encontrado', err });
	}
});
router.delete('/user/me', auth, async (req, res) => {
	const id = res.locals.authData;
  console.log(id)
	try {
		await User.deleteOne({ _id: id }).then(() => {
			return res.status(204).send();
		});
	} catch (err) {
		return res.status(500).send({ error: 'erro ao remover usuário', err });
	}
});
router.post('/user', async (req, res) => {
	const { email, password, displayName } = req.body;
	console.log(req.body);

	if (!displayName)
		return res
			.status(400)
			.send({ error: "'displayName' must have at least 8 characters" });
	if (!email)
		return res.status(400).send({ error: "'email' must be a valid email" });
	if (!password)
		return res
			.status(400)
			.send({ error: "'password' must have at least 6 characters" });
	try {
		if (await User.findOne({ email }))
			return res.status(400).send({ error: 'usuario já registrado' });

		const user = await User.create(req.body);
		user.password = undefined;
		console.log('userid', user._id);
		return res.status(201).send({ user, token: createUserToken(user._id) });
	} catch (err) {
		console.log(err);
		return res.status(500).send({ error: 'erro ao criar usuário' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).send({ error: 'dados insuficientes' });

	try {
		const user = await User.findOne({ email }).select('+password');
		if (!user) return res.status(400).send({ error: 'erro ao buscar usuário' });
		const authOk = await bcrypt.compare(password, user.password);
		if (!authOk)
			return res.status(401).send({ error: 'erro ao autenticar usuário' });
		return res.send({ token: createUserToken(user.id) });
	} catch (err) {
		return res
			.status(500)
			.send({ error: 'usuário nao encontrado', reason: err });
	}
});

module.exports = router;
