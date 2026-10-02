const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");
const auth = require("../middleware/auth.middleware");

router.post("/criar", auth, chatController.criarConversa);
router.get("/listar", auth, chatController.listarConversas);
router.get("/:id", auth, chatController.buscarConversa);
router.post("/:id/mensagem", auth, chatController.enviarMensagem);
router.delete("/:id", auth, chatController.excluirConversa);

module.exports = router;