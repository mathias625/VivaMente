const express = require("express");
const router = express.Router();

const controller = require("../controllers/conteudo.controller");

router.get("/", controller.listar);
router.post("/", controller.cadastrar);
router.get("/:id", controller.buscar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;