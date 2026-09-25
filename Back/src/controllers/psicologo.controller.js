const service = require("../services/psicologo.services");

const executar = (fn, status = 200) => async (req, res) => {
    try {
        return res.status(status).json(await fn(req));
    } catch (e) {
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

const listarPacientes = async (req, res) => {
    return res.status(200).json(
        await service.listarPacientes(req.usuario)
    );
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    listarPacientes
};
