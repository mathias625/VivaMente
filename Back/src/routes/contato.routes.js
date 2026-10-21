const express = require("express");

const router = express.Router();

const c = require("../controllers/contato.controller");
const auth = require("../middleware/auth.middleware");
const permitir = require("../middleware/permissao.middleware");

// Limite simples por IP para a rota pública: 5 mensagens a cada 10 minutos.
const JANELA_MS = 10 * 60 * 1000;
const MAXIMO = 5;
const tentativas = new Map();

const limitar = (req, res, next) => {
    const agora = Date.now();
    const chave = req.ip || "desconhecido";

    for (const [ip, marcas] of tentativas) {
        const recentes = marcas.filter((t) => agora - t < JANELA_MS);
        if (recentes.length) tentativas.set(ip, recentes);
        else tentativas.delete(ip);
    }

    const recentes = tentativas.get(chave) || [];

    if (recentes.length >= MAXIMO) {
        return res.status(429).json({
            mensagem: "Muitas mensagens em pouco tempo. Aguarde alguns minutos e tente novamente."
        });
    }

    recentes.push(agora);
    tentativas.set(chave, recentes);
    next();
};

router.post("/", limitar, c.registrar);
router.get("/listar", auth, permitir("psicologo"), c.listar);

module.exports = router;
