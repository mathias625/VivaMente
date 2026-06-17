require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

const conteudoRoutes =
require("./src/routes/conteudo.routes");

const checkinRoutes =
require("./src/routes/checkin.routes");

const ajudaRoutes =
require("./src/routes/ajuda.routes");

const dicasRoutes =
require("./src/routes/dicas.routes");

app.use("/conteudo", conteudoRoutes);

app.use("/checkin", checkinRoutes);

app.use("/ajuda", ajudaRoutes);

app.use("/dicas", dicasRoutes);

app.listen(3000, () => {

    console.log("rodando na porta 3000");

});