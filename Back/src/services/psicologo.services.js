
const prisma = require("../data/prisma");
const { hashPassword } = require("../utils/password");
const { criptografar, descriptografar } = require("../utils/crypto");

const limpar = (psicologo) => ({
    id: psicologo.id,
    nome: descriptografar(psicologo.nome),
    email: descriptografar(psicologo.email)
});

const cadastrar = async (dados) => {
    if (!dados.nome || !dados.email || !dados.senha) {
        throw new Error("Nome, e-mail e senha são obrigatórios");
    }

    const email = dados.email.trim().toLowerCase();

    const existente = await prisma.psicologo.findUnique({
        where: { email }
    });

    if (existente) {
        throw new Error("E-mail já cadastrado");
    }

    const psicologo = await prisma.psicologo.create({
        data: {
            nome: criptografar(dados.nome),
            email,
            senha: await hashPassword(dados.senha)
        }
    });

    return limpar(psicologo);
};

const listar = async (usuario) => {
    if (usuario.tipo === "paciente") {
        const paciente = await prisma.paciente.findUnique({
            where: { id: usuario.id },
            select: { psicologoId: true }
        });

        if (!paciente) {
            return [];
        }

        const psicologo = await prisma.psicologo.findUnique({
            where: { id: paciente.psicologoId },
            select: {
                id: true,
                nome: true,
                email: true
            }
        });

        return psicologo ? [limpar(psicologo)] : [];
    }

    const psicologos = await prisma.psicologo.findMany({
        select: {
            id: true,
            nome: true,
            email: true
        }
    });

    return psicologos.map(limpar);
};

const buscar = async (id, usuario) => {
    const n = Number(id);

    if (!Number.isInteger(n) || n <= 0) {
        throw new Error("ID inválido");
    }

    if (usuario.tipo === "paciente") {
        throw new Error("Acesso negado");
    }

    if (usuario.tipo === "psicologo" && usuario.id !== n) {
        throw new Error("Acesso negado");
    }

    const psicologo = await prisma.psicologo.findUnique({
        where: { id: n },
        include: {
            pacientes: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    pontos: true
                }
            },
            consultas: true
        }
    });

    if (!psicologo) {
        throw new Error("Psicólogo não encontrado");
    }

    return {
        ...limpar(psicologo),
        pacientes: psicologo.pacientes.map((paciente) => ({
            ...paciente,
            nome: descriptografar(paciente.nome),
            email: descriptografar(paciente.email)
        })),
        consultas: psicologo.consultas
    };
};

const atualizar = async (id, dados, usuario) => {
    const n = Number(id);

    if (usuario.tipo !== "psicologo" || usuario.id !== n) {
        throw new Error("Você só pode alterar seu próprio perfil");
    }

    const permitidos = {};

    if (dados.nome !== undefined) {
        permitidos.nome = criptografar(dados.nome);
    }

    if (dados.email !== undefined) {
        permitidos.email = dados.email.trim().toLowerCase();
    }

    if (dados.senha) {
        permitidos.senha = await hashPassword(dados.senha);
    }

    if (!Object.keys(permitidos).length) {
        throw new Error("Nenhum dado informado para atualização");
    }

    const atualizado = await prisma.psicologo.update({
        where: { id: n },
        data: permitidos,
        select: {
            id: true,
            nome: true,
            email: true
        }
    });

    return limpar(atualizado);
};

const excluir = async (id, usuario) => {
    const n = Number(id);

    if (usuario.tipo !== "psicologo" || usuario.id !== n) {
        throw new Error("Você só pode excluir seu próprio perfil");
    }

    return prisma.psicologo.delete({
        where: { id: n }
    });
};

const listarPacientes = async (usuario) => {
    const pacientes = await prisma.paciente.findMany({
        where: { psicologoId: usuario.id },
        select: {
            id: true,
            nome: true,
            email: true,
            pontos: true
        }
    });

    return pacientes.map((paciente) => ({
        ...paciente,
        nome: descriptografar(paciente.nome),
        email: descriptografar(paciente.email)
    }));
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    listarPacientes
};
