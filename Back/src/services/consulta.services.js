const prisma = require("../data/prisma");
const { descriptografar } = require("../utils/crypto");

const descriptografarPessoa = pessoa => pessoa && ({
    ...pessoa,
    nome: descriptografar(pessoa.nome),
    email: descriptografar(pessoa.email)
});

const validarId = id => {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) throw new Error("ID inválido");
    return n;
};

const validarData = valor => {
    const data = new Date(valor);
    if (!valor || Number.isNaN(data.getTime())) throw new Error("Data da consulta inválida");
    return data;
};

const cadastrar = async (dados, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem criar consultas");
    const pacienteId = validarId(dados.pacienteId);
    const paciente = await prisma.paciente.findFirst({
        where: { id: pacienteId, psicologoId: usuario.id },
        select: { id: true }
    });
    if (!paciente) throw new Error("Paciente não encontrado ou não pertence a você");

    return prisma.consulta.create({
        data: {
            data: validarData(dados.data),
            psicologoId: usuario.id,
            pacienteId
        },
        include: { paciente: { select: { id: true, nome: true, email: true } } }
    }).then(consulta => ({ ...consulta, paciente: descriptografarPessoa(consulta.paciente) }));
};

const listar = async usuario => {
    if (usuario.tipo === "psicologo") {
        const consultas = await prisma.consulta.findMany({
            where: { psicologoId: usuario.id },
            include: { paciente: { select: { id: true, nome: true, email: true } } },
            orderBy: { data: "asc" }
        });
        return consultas.map(c => ({ ...c, paciente: descriptografarPessoa(c.paciente) }));
    }

    const consultas = await prisma.consulta.findMany({
        where: { pacienteId: usuario.id },
        include: { psicologo: { select: { id: true, nome: true, email: true } } },
        orderBy: { data: "asc" }
    });
    return consultas.map(c => ({ ...c, psicologo: descriptografarPessoa(c.psicologo) }));
};

const buscar = async (id, usuario) => {
    const consulta = await prisma.consulta.findUnique({
        where: { id: validarId(id) },
        include: {
            psicologo: { select: { id: true, nome: true, email: true } },
            paciente: { select: { id: true, nome: true, email: true } }
        }
    });
    if (!consulta) throw new Error("Consulta não encontrada");

    const autorizado = usuario.tipo === "psicologo"
        ? consulta.psicologoId === usuario.id
        : usuario.tipo === "paciente" && consulta.pacienteId === usuario.id;
    if (!autorizado) throw new Error("Acesso negado");

    return {
        ...consulta,
        psicologo: descriptografarPessoa(consulta.psicologo),
        paciente: descriptografarPessoa(consulta.paciente)
    };
};

const atualizar = async (id, dados, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem atualizar consultas");
    const consulta = await buscar(id, usuario);
    const alteracoes = {};

    if (dados.data !== undefined) alteracoes.data = validarData(dados.data);
    if (dados.pacienteId !== undefined) {
        const pacienteId = validarId(dados.pacienteId);
        const paciente = await prisma.paciente.findFirst({
            where: { id: pacienteId, psicologoId: usuario.id }, select: { id: true }
        });
        if (!paciente) throw new Error("Paciente não encontrado ou não pertence a você");
        alteracoes.pacienteId = pacienteId;
    }

    return prisma.consulta.update({
        where: { id: consulta.id },
        data: alteracoes,
        include: { paciente: { select: { id: true, nome: true, email: true } } }
    }).then(c => ({ ...c, paciente: descriptografarPessoa(c.paciente) }));
};

const excluir = async (id, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem excluir consultas");
    const consulta = await buscar(id, usuario);
    return prisma.consulta.delete({ where: { id: consulta.id } });
};

module.exports = { cadastrar, listar, buscar, atualizar, excluir };
