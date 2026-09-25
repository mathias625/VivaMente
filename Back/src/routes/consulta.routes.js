const express = require("express");

const router = express.Router();

const c = require("../controllers/consulta.controller");
const auth = require("../middleware/auth.middleware");

router.use(auth);

router.post("/cadastrar", c.cadastrar);
router.get("/listar", c.listar);
router.get("/buscar/:id", c.buscar);
router.put("/atualizar/:id", c.atualizar);
router.delete("/excluir/:id", c.excluir);

module.exports = router;
