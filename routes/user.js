const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config")

//aux functions
const createUserToken = (userId) => jwt.sign({id:userId}, config.jwtToken, {expiresIn: config.jwtExpiration});

router.get("/", async (req, res) => {
  try {
    const {id} = req.query
    console.log(id)
    const users = id ?await User.find({_id:id}) :await User.find({});
    return res.send(users);
  } catch (err) {
    res.status(500).send({ error: "erro na consulta de usuario", err });
  }
});

router.post("/user", async (req, res) => {
  const { email, password ,displayName} = req.body;
  console.log(req.body)

  if(!displayName) return res.status(400).send({ error: "'displayName' must have at least 8 characters" });
  if(!email) return res.status(400).send({ error: "'email' must be a valid email" });
  if(!password) return res.status(400).send({ error: "'password' must have at least 6 characters" });
  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: "usuario já registrado" });

    const user = await User.create(req.body);
    user.password = undefined;

    return res.status(201).send({user, token: createUserToken(user.id)});
  } catch (err) {
    console.log(err)
    return res.status(500).send({ error: "erro ao criar usuário" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ error: "dados insuficientes" });

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).send({ error: "erro ao buscar usuário" });

    const authOk = await bcrypt.compare(password, user.password);
    if (!authOk) return res.status(401).send({ error: "erro ao autenticar usuário" });

    user.password = undefined;
    return res.send({user, token: createUserToken(user.id)});
  } catch (err) {
    return res.status(500).send({ error: "usuário nao encontrado", reason: err });
  }
});

module.exports = router;
