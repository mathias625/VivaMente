const service = require("../services/checkin.services");

const consultar = async (req, res) => {
    try {
        return res.json(await service.consultar(req.usuario));
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message });
    }
};

const registrar = async (req, res) => {
    try {
        return res.status(201).json(await service.registrar(req.usuario));
    } catch (erro) {
        const jaFeito = erro.message === "Você já fez seu check-in de hoje";
        return res.status(jaFeito ? 409 : 400).json({ mensagem: erro.message });
    }
};

module.exports = { consultar, registrar };
