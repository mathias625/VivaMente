const db = require("../data/connection");

const listar = async (req, res) => {
    const produtos = await db.query("SELECT * FROM produto");
    res.json(produtos[0]);
};

const cadastrar = async (req, res) => {
    const { nome, imagem, preco, categoria, marca } = req.body;

    const result = await db.query(
        "INSERT INTO produto (nome, imagem, preco, categoria, marca) VALUES (?, ?, ?, ?, ?)",
        [nome, imagem, preco, categoria, marca]
    );

    res.json({ id: result[0].insertId, ...req.body });
};

const buscar = async (req, res) => {
    const result = await db.query("SELECT * FROM produto WHERE id = ?", [req.params.id]);
    res.json(result[0]);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const { nome, imagem, preco, categoria, marca } = req.body;

    await db.query(
        "UPDATE produto SET nome=?, imagem=?, preco=?, categoria=?, marca=? WHERE id=?",
        [nome, imagem, preco, categoria, marca, id]
    );

    res.json({ id, ...req.body });
};

const excluir = async (req, res) => {
    await db.query("DELETE FROM produto WHERE id=?", [req.params.id]);
    res.json({ msg: "excluído" });
};

module.exports = { listar, cadastrar, buscar, atualizar, excluir };