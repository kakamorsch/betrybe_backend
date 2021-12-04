const jwt = require("jsonwebtoken");
const config = require("../config/config")


const auth = (req, res, next) => {
    const token_header = req.headers.auth;
    if(!token_header) return res.status(401).send({error: "Autenticacao recusada!"})

    jwt.verify(token_header, config.jwtToken, (err, decoded) => {
        if(err) res.status(401).send({error: "o token enviado nao eh valido"})
        res.locals.authData = decoded
        return next();
    })

}

module.exports = auth;