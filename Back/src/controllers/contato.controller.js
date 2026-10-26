const service = require("../services/contato.services");

const registrar = async (req, res) => {
    try {
        await service.registrar(req.body);

        return res.status(201).json({
            mensagem: "Mensagem recebida. Obrigado por falar com a gente."
        });
    } catch (error) {
        if (error instanceof service.ErroValidacao) {
            return res.status(400).json({
                mensagem: error.message,
                erros: error.erros
            });
        }

        console.error(error);

        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        });
    }
};

const listar = async (req, res) => {
    try {
        return res.status(200).json(await service.listar());
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        });
    }
};

module.exports = {
    registrar,
    listar
};
