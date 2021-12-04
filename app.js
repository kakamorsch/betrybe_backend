const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/config")
const url = config.bdString;
const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 5,
  useNewUrlParser: true,
};

mongoose.connect(url, options);
mongoose.set("useCreateIndex", true);

mongoose.connection.on("error", (err) =>
  console.log("erro na conexao com o banco de dados", err)
);

mongoose.connection.on("disconnect", () => console.log("conexao encerrada"))

mongoose.connection.on("connected", () => console.log("conexao estabelecida com sucesso"))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const indexRoute = require("./routes/index");
const userRoute = require("./routes/user");

app.use("/", indexRoute);
app.use("/", userRoute);

app.listen(3000);

module.exports = app;
