const prisma = require("../data/prisma");
const { comparePassword } = require("../utils/password");
const { criarToken } = require("../utils/token");
const { descriptografar } = require("../utils/crypto");

const validarLogin = async (email, senha, tipo) => {
    const usuario = tipo === "psicologo" ? await prisma.psicologo.findUnique({
        where: { email }
    }) : tipo === "paciente" ? await prisma.paciente.findUnique({
        where: { email }
    }) : null;

    if (!usuario || !comparePassword(senha, usuario.senha)) throw Error("Email ou senha inválidos");
    return {
        usuario: {
            id: usuario.id,
            nome: descriptografar(usuario.nome),
            email: descriptografar(usuario.email),
            tipo
        }, token: criarToken({
            id: usuario.id,
            tipo
        }, process.env.JWT_EXPIRES_IN || "1h")
    }
};

module.exports = {
    validarLogin
};
