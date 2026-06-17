const db = require("../data/connection");
async function cadastrar(req, res){
    const emocao =
    req.body.emocao;
    const texto =
    req.body.texto;
    const usuario_id =
    req.body.usuario_id;
    await db.query(
        "INSERT INTO checkin (emocao, texto, usuario_id) VALUES (?, ?, ?)",
        [
            emocao,
            texto,
            usuario_id
        ]
    );
    res.json({
        mensagem: "Check-in salvo!"
    });
}
module.exports = {
    cadastrar
};