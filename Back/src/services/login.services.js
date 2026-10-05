const prisma = require("../data/prisma");
const { comparePassword } = require("../utils/password");
const { criarToken } = require("../utils/token");

const validarLogin = async (email, senha, tipo) => {
    const usuario = tipo === "psicologo"
        ? await prisma.psicologo.findUnique({
            where: { email }
        })
        : tipo === "paciente"
            ? await prisma.paciente.findUnique({
                where: { email }
            })
            : null;

    if (!usuario || !comparePassword(senha, usuario.senha)) {
        throw Error("Email ou senha inválidos");
    }

    const dadosUsuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo
    };

    return {
        usuario: dadosUsuario,
        token: criarToken(
            {
                id: usuario.id,
                tipo
            },
            process.env.JWT_EXPIRES_IN || "1h"
        )
    };
};

module.exports = {
    validarLogin
};