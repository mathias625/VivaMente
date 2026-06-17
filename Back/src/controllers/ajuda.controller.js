const db = require("../data/connection");

async function cadastrar(req, res){

    const tipo = req.body.tipo;

    const mensagem = req.body.mensagem;

    const usuario_id = req.body.usuario_id;

    await db.query(
        "INSERT INTO ajuda (tipo, mensagem, usuario_id) VALUES (?, ?, ?)",
        [tipo, mensagem, usuario_id]
    );

    res.json({
        mensagem: "Mensagem enviada!"
    });

}

module.exports = {
    cadastrar
};