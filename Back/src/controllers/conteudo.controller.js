const db = require("../data/connection");

const listar = async (req, res) => {
    const result = await db.query(`
        SELECT c.*, cat.nome as categoria
        FROM conteudo c
        LEFT JOIN categoria cat ON c.categoria_id = cat.id
    `);
    res.json(result[0]);
};

const cadastrar = async (req, res) => {
    const { titulo, descricao, imagem, categoria_id, autor } = req.body;

    const result = await db.query(
        "INSERT INTO conteudo (titulo, descricao, imagem, categoria_id, autor) VALUES (?, ?, ?, ?, ?)",
        [titulo, descricao, imagem, categoria_id, autor]
    );

    res.json({ id: result[0].insertId, ...req.body });
};

const buscar = async (req, res) => {
    const result = await db.query("SELECT * FROM conteudo WHERE id=?", [req.params.id]);
    res.json(result[0]);
};

const atualizar = async (req, res) => {
    const { titulo, descricao, imagem, categoria_id, autor } = req.body;

    await db.query(
        "UPDATE conteudo SET titulo=?, descricao=?, imagem=?, categoria_id=?, autor=? WHERE id=?",
        [titulo, descricao, imagem, categoria_id, autor, req.params.id]
    );

    res.json({ msg: "atualizado" });
};

const excluir = async (req, res) => {
    await db.query("DELETE FROM conteudo WHERE id=?", [req.params.id]);
    res.json({ msg: "excluído" });
};

module.exports = { listar, cadastrar, buscar, atualizar, excluir };