const service = require("../services/paciente.services");

const executar = (fn, status = 200) => async (req, res) => {
    try {
        console.log("ROTA PACIENTE EXECUTADA");
        console.log("BODY:", req.body);
        console.log("USUARIO:", req.usuario);

        return res.status(status).json(await fn(req));
    } catch (e) {
        console.error("ERRO NO CONTROLLER:", e);

        return res.status(400).json({
            mensagem: e.message
        });
    }
};

const cadastrar = executar(
    req => service.cadastrar(req.body, req.usuario),
    201
);

const listar = executar(
    req => service.listar(req.usuario)
);

const buscar = executar(
    req => service.buscar(req.params.id, req.usuario)
);

const atualizar = executar(
    req => service.atualizar(req.params.id, req.body, req.usuario)
);

const excluir = executar(
    req => service.excluir(req.params.id, req.usuario)
);

const meuPsicologo = async (req, res) => {
    try {
        console.log("ROTA MEU PSICOLOGO EXECUTADA");
        console.log("USUARIO:", req.usuario);

        return res.status(200).json(
            await service.meuPsicologo(req.usuario)
        );
    } catch (e) {
        console.error("ERRO NO MEU PSICOLOGO:", e);

        return res.status(400).json({
            mensagem: e.message
        });
    }
};

const registrarCheckin = executar(
    req => service.registrarCheckin(req.usuario.id, req.usuario),
    200
);

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    meuPsicologo,
    registrarCheckin
};