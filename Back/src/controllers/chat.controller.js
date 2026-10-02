const chatService = require("../services/chat.services");

const criarConversa = async (req, res) => {
    try {
        const conversa = await chatService.criarConversa(req.usuario);

        res.status(201).json(conversa);
    } catch (error) {
        res.status(400).json({
            mensagem: error.message
        });
    }
};

const listarConversas = async (req, res) => {
    try {
        const conversas = await chatService.listarConversas(req.usuario);

        res.status(200).json(conversas);
    } catch (error) {
        res.status(400).json({
            mensagem: error.message
        });
    }
};

const buscarConversa = async (req, res) => {
    try {
        const conversa = await chatService.buscarConversa(
            req.params.id,
            req.usuario
        );

        res.status(200).json(conversa);
    } catch (error) {
        res.status(400).json({
            mensagem: error.message
        });
    }
};

const enviarMensagem = async (req, res) => {
    try {
        const { texto } = req.body;

        const resposta = await chatService.enviarMensagem(
            req.params.id,
            texto,
            req.usuario
        );

        res.status(200).json(resposta);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            mensagem: error.message
        });
    }
};

const excluirConversa = async (req, res) => {
    try {
        await chatService.excluirConversa(
            req.params.id,
            req.usuario
        );

        res.status(200).json({
            mensagem: "Conversa excluída com sucesso"
        });
    } catch (error) {
        res.status(400).json({
            mensagem: error.message
        });
    }
};

module.exports = {
    criarConversa,
    listarConversas,
    buscarConversa,
    enviarMensagem,
    excluirConversa
};