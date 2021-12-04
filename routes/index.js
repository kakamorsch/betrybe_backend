const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");


router.get("/", auth, (req, res) => {
    console.log(res.locals.authData)
    return res.send({message: `privado!!!`})
})

router.post("/", (req, res) => {
    return res.send({message: `tudo certo com o metodo POST`})
})

module.exports = router