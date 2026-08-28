const express = require("express");

const router = express.Router();

const c = require("../controllers/paciente.controller");
const auth = require("../middleware/auth.middleware");
const permitir = require("../middleware/permissao.middleware");

router.post("/cadastrar", auth, permitir("psicologo"), c.cadastrar);
router.get("/listar", auth, permitir("psicologo", "paciente"), c.listar);
router.get("/buscar/:id", auth, permitir("psicologo", "paciente"), c.buscar);
router.put("/atualizar/:id", auth, permitir("psicologo", "paciente"), c.atualizar);
router.delete("/excluir/:id", auth, permitir("psicologo"), c.excluir);
router.get("/meu-psicologo", auth, permitir("paciente"), c.meuPsicologo);

module.exports = router;
