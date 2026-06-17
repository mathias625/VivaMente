const db = require("../data/connection");

async function listar(req, res){

    const [dados] =
    await db.query(
        "SELECT * FROM dicas"
    );

    res.json(dados);

}

async function cadastrar(req, res){

    const titulo =
    req.body.titulo;

    const categoria =
    req.body.categoria;

    const descricao =
    req.body.descricao;

    await db.query(

        "INSERT INTO dicas (titulo, categoria, descricao) VALUES (?, ?, ?)",

        [
            titulo,
            categoria,
            descricao
        ]

    );

    res.json({
        mensagem: "Dica adicionada!"
    });

}

module.exports = {
    listar,
    cadastrar
};