require('dotenv').config()
const env = process.env.NODE_ENV || "dev";
const config = () => {
    switch(env) {
        case "dev":
        return{
            bdString: process.env.DBSECRET,
            jwtToken: "andar fome tempo menta",
            jwtExpiration: "7d"
        }
        
        case "hml":
        return {
            bdString: "mongodb+srv://usr:passwd@cluster0.rf0vi.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority",
            jwtToken: "andar fome tempo menta",
            jwtExpiration: "1d"
        }
        
        case "prod":
        return {
            bdString: "mongodb+srv://usr:passwd@cluster0.rf0vi.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority",
            jwtToken: "andar fome tempo menta",
            jwtExpiration: "1d"
        }
    }
}

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`)

module.exports = config();