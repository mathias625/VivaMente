const prisma = require("../data/prisma");
const { hashPassword } = require("../utils/password");
const { criptografar, descriptografar } = require("../utils/crypto");

const limpar = paciente => ({
    id: paciente.id,
    nome: descriptografar(paciente.nome),
    email: descriptografar(paciente.email),
    pontos: paciente.pontos,
    psicologoId: paciente.psicologoId
});

const validarId = id => {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) throw new Error("ID inválido");
    return n;
};

const cadastrar = async (dados, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem cadastrar pacientes");
    if (!dados.nome || !dados.email || !dados.senha) {
        throw new Error("Nome, e-mail e senha são obrigatórios");
    }
    const email = dados.email.trim().toLowerCase();
    if (await prisma.paciente.findUnique({ where: { email } })) throw new Error("E-mail já cadastrado");

    const paciente = await prisma.paciente.create({
        data: {
            nome: criptografar(dados.nome),
            email,
            senha: hashPassword(dados.senha),
            psicologoId: usuario.id,
            pontos: 0
        }
    });
    return limpar(paciente);
};

const listar = async usuario => {
    const where = usuario.tipo === "psicologo"
        ? { psicologoId: usuario.id }
        : { id: usuario.id };
    const lista = await prisma.paciente.findMany({ where });
    return lista.map(limpar);
};

const buscar = async (id, usuario) => {
    const n = validarId(id);
    if (usuario.tipo === "paciente" && usuario.id !== n) throw new Error("Você só pode acessar seu próprio perfil");

    const paciente = await prisma.paciente.findUnique({
        where: { id: n },
        include: {
            psicologo: { select: { id: true, nome: true, email: true } },
            consultas: true,
            tarefas: true
        }
    });
    if (!paciente) throw new Error("Paciente não encontrado");
    if (usuario.tipo === "psicologo" && paciente.psicologoId !== usuario.id) {
        throw new Error("Paciente não pertence a você");
    }

    return {
        ...limpar(paciente),
        psicologo: {
            ...paciente.psicologo,
            nome: descriptografar(paciente.psicologo.nome),
            email: descriptografar(paciente.psicologo.email)
        },
        consultas: paciente.consultas,
        tarefas: paciente.tarefas
    };
};

const atualizar = async (id, dados, usuario) => {
    const n = validarId(id);
    const atual = await prisma.paciente.findUnique({ where: { id: n } });
    if (!atual) throw new Error("Paciente não encontrado");

    if (usuario.tipo === "paciente" && usuario.id !== n) throw new Error("Você só pode alterar seu próprio perfil");
    if (usuario.tipo === "psicologo" && atual.psicologoId !== usuario.id) throw new Error("Paciente não pertence a você");

    const permitidos = {};
    if (dados.nome !== undefined) permitidos.nome = criptografar(dados.nome);
    if (dados.email !== undefined) permitidos.email = dados.email.trim().toLowerCase();
    if (dados.senha) permitidos.senha = hashPassword(dados.senha);

    if (usuario.tipo === "psicologo" && dados.psicologoId !== undefined) {
        throw new Error("Não é permitido transferir o paciente por esta rota");
    }
    if (!Object.keys(permitidos).length) throw new Error("Nenhum campo permitido para atualização");

    const atualizado = await prisma.paciente.update({
        where: { id: n }, data: permitidos
    });
    return limpar(atualizado);
};

const excluir = async (id, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem excluir pacientes");
    const paciente = await buscar(id, usuario);
    return prisma.paciente.delete({ where: { id: paciente.id } });
};

const meuPsicologo = async usuario => {
    const paciente = await prisma.paciente.findUnique({
        where: { id: usuario.id },
        include: { psicologo: { select: { id: true, nome: true, email: true } } }
    });
    if (!paciente) throw new Error("Paciente não encontrado");
    return {
        ...paciente.psicologo,
        nome: descriptografar(paciente.psicologo.nome),
        email: descriptografar(paciente.psicologo.email)
    };
};

module.exports = { cadastrar, listar, buscar, atualizar, excluir, meuPsicologo };
