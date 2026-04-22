require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const routes = require("./src/routes/produtos.routes");
app.use("/produtos", routes);

app.listen(3000, () => console.log("rodando na porta 3000"));