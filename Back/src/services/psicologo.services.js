const prisma = require("../data/prisma");
const { hashPassword } = require("../utils/password");

<<<<<<< HEAD

const safe = p => ({
    ...p, nome: descriptografar(p.nome), email: descriptografar(p.email)
=======
const safe = (p) => ({
    ...p
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
});

const cadastrar = async (data) => {
    if (!data.nome || !data.email || !data.senha) {
        throw new Error("nome, email e senha são obrigatórios");
    }

    if (await prisma.psicologo.findUnique({
        where: {
            email: data.email
        }
    })) {
        throw new Error("Email já cadastrado");
    }

    return safe(await prisma.psicologo.create({
        data: {
            nome: data.nome,
            email: data.email,
            senha: hashPassword(data.senha)
        }
    }));
};

const listar = async (usuario) => {
    if (usuario.tipo === "paciente") {
        const p = await prisma.paciente.findUnique({
            where: {
                id: usuario.id
            },
            select: {
                psicologoId: true
            }
        });

        if (!p) {
            throw Error("Paciente não encontrado");
        }

        const x = await prisma.psicologo.findUnique({
            where: {
                id: p.psicologoId
            },
            select: {
                id: true,
                nome: true,
                email: true
            }
        });

        return x ? [safe(x)] : [];
    }

    const l = await prisma.psicologo.findMany({
        select: {
            id: true,
            nome: true,
            email: true
        }
    });

    return l.map(safe);
};

const buscar = async (id, usuario) => {
    const n = Number(id);

    if (usuario.tipo === "paciente") {
        const paciente = await prisma.paciente.findUnique({
            where: {
                id: usuario.id
            },
            select: {
                psicologoId: true
            }
        });

        if (!paciente || paciente.psicologoId !== n) {
            throw new Error("Acesso negado");
        }
    }

    const p = await prisma.psicologo.findUnique({
        where: {
            id: n
        },
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

    if (!p) {
        throw new Error("Psicólogo não encontrado");
    }

<<<<<<< HEAD
    return {
        ...p,
        nome: descriptografar(p.nome),
        email: descriptografar(p.email),

        pacientes: p.pacientes.map((paciente) => ({
            ...paciente,
            nome: descriptografar(paciente.nome),
            email: descriptografar(paciente.email)
        }))
    };
=======
    return safe(p);
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
};

const atualizar = async (id, dados, usuario) => {
    const n = Number(id);

    if (usuario.id !== n) {
        throw new Error("Você só pode alterar seu próprio perfil");
    }

    if (dados.senha) {
        dados.senha = hashPassword(dados.senha);
    }

    const p = await prisma.psicologo.update({
        where: {
            id: n
        },
        data: dados,
        select: {
            id: true,
            nome: true,
            email: true
        }
    });

    return safe(p);
};

const excluir = async (id, usuario) => {
    if (usuario.id !== Number(id)) {
        throw new Error("Você só pode excluir seu próprio perfil");
    }

    return prisma.psicologo.delete({
        where: {
            id: Number(id)
        }
    });
};

const listarPacientes = async (usuario) => {
<<<<<<< HEAD
    const pacientes = await prisma.paciente.findMany({
        where: { psicologoId: usuario.id },
=======
    const p = await prisma.paciente.findMany({
        where: {
            psicologoId: usuario.id
        },
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
        select: {
            id: true,
            nome: true,
            email: true,
            pontos: true
        }
    });

<<<<<<< HEAD
    return pacientes.map((paciente) => ({
        ...paciente,
        nome: descriptografar(paciente.nome),
        email: descriptografar(paciente.email)
    }));
=======
    return p.map(safe);
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    listarPacientes
};