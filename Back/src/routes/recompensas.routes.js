const express = require("express");

const router = express.Router();

const c = require("../controllers/recompensas.controller");
const auth = require("../middleware/auth.middleware");
const permitir = require("../middleware/permissao.middleware");

router.use(auth);

router.post("/cadastrar", permitir("psicologo"), c.cadastrar);
router.get("/listar", permitir("psicologo", "paciente"), c.listar);
router.get("/buscar/:id", permitir("psicologo", "paciente"), c.buscar);
router.put("/atualizar/:id", permitir("psicologo"), c.atualizar);
router.delete("/excluir/:id", permitir("psicologo"), c.excluir);
router.post("/comprar/:id", permitir("paciente"), c.comprar);

module.exports = router;
