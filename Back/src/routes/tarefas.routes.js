const express = require("express");

const router = express.Router();

const c = require("../controllers/tarefas.controller");
const auth = require("../middleware/auth.middleware");
const permitir = require("../middleware/permissao.middleware");

router.use(auth);

router.post("/cadastrar", permitir("psicologo"), c.cadastrar);
router.get("/listar", permitir("psicologo", "paciente"), c.listar);
router.get("/buscar/:id", permitir("psicologo", "paciente"), c.buscar);
router.put("/atualizar/:id", permitir("psicologo", "paciente"), c.atualizar);
router.delete("/excluir/:id", permitir("psicologo"), c.excluir);

module.exports = router;
