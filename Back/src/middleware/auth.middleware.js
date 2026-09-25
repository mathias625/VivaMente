const { verificarToken } = require("../utils/token");

module.exports = (req, res, next) => {
    try {
        console.log("HEADER RECEBIDO:", req.headers.authorization);

        const h = req.headers.authorization;

        if (!h) {
            return res.status(401).json({
                mensagem: "Token não informado"
            });
        }

        const [b, t] = h.split(" ");

        if (b !== "Bearer" || !t) {
            throw Error("Formato do token inválido");
        }

        req.usuario = verificarToken(t);

        console.log("USUARIO AUTENTICADO:", req.usuario);

        next();

    } catch (e) {

        console.error("ERRO AUTH:", e);

        res.status(401).json({
            mensagem: e.message || "Token inválido ou expirado"
        });
    }
};