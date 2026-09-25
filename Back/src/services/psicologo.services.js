const prisma = require("../data/prisma");
const { hashPassword } = require("../utils/password");
const { criptografar, descriptografar } = require("../utils/crypto");

const safe = p => ({
    ...p, nome: descriptografar(p.nome), email: descriptografar(p.email)
});

const cadastrar = async data => {
    if (!data.nome || !data.email || !data.senha) throw new Error("nome, email e senha são obrigatórios");
    if (await prisma.psicologo.findUnique({
        where: { email: data.email }
    })) throw new Error("Email já cadastrado");

    return safe(await prisma.psicologo.create({
        data: {
            nome: criptografar(data.nome),
            email: data.email,
            senha: hashPassword(data.senha)
        }
    }));
};

const listar = async usuario => {
    if (usuario.tipo === "paciente") {
        const p = await prisma.paciente.findUnique({
            where: { id: usuario.id },
            select: { psicologoId: true }
        });

        if (!p) throw Error("Paciente não encontrado");
        const x = await prisma.psicologo.findUnique({
            where: { id: p.psicologoId },
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

    if (usuario.tipo === 'paciente' && usuario.id !== n) {
        throw new Error("Acesso negado");
    }

    const p = await prisma.psicologo.findUnique({
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

    if (!p) {
        throw new Error("Psicólogo não encontrado");
    }

    return p;
};

const atualizar = async (id, dados, usuario) => {
    const n = Number(id);
    if (usuario.id !== n) throw new Error("Você só pode alterar seu próprio perfil");
    if (dados.nome) dados.nome = criptografar(dados.nome);
    if (dados.senha) dados.senha = hashPassword(dados.senha);
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
    }
    );
    return safe(p);
}
    ;
const excluir = async (id, usuario) => {
    if (usuario.id !== Number(id)) throw new Error("Você só pode excluir seu próprio perfil");

    return prisma.psicologo.delete({
        where: { id: Number(id) }
    });
};

const listarPacientes = async (usuario) => {
    const p = await prisma.paciente.findMany({
        where: { psicologoId: usuario.id },
        select: {
            id: true,
            nome: true,
            email: true,
            pontos: true
        }
    }
    );
    return p.map(safe);
}
    ;
module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    listarPacientes
}
    ;
