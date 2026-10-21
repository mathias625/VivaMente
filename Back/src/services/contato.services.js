const prisma = require("../data/prisma");

const ASSUNTOS = ["duvida", "acesso", "sugestao", "elogio", "outro"];
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITES = {
    nomeMin: 2,
    nomeMax: 100,
    emailMax: 150,
    mensagemMin: 10,
    mensagemMax: 2000
};

class ErroValidacao extends Error {
    constructor(erros) {
        super("Confira os campos destacados.");
        this.erros = erros;
    }
}

const texto = (valor) => (typeof valor === "string" ? valor.trim() : "");

const validar = (data = {}) => {
    const valores = {
        nome: texto(data.nome),
        email: texto(data.email),
        assunto: texto(data.assunto),
        mensagem: texto(data.mensagem)
    };
    const erros = {};

    if (!valores.nome) {
        erros.nome = "Informe seu nome.";
    } else if (valores.nome.length < LIMITES.nomeMin) {
        erros.nome = `O nome precisa ter pelo menos ${LIMITES.nomeMin} letras.`;
    } else if (valores.nome.length > LIMITES.nomeMax) {
        erros.nome = `O nome pode ter no máximo ${LIMITES.nomeMax} caracteres.`;
    }

    if (!valores.email) {
        erros.email = "Informe seu e-mail.";
    } else if (!REGEX_EMAIL.test(valores.email) || valores.email.length > LIMITES.emailMax) {
        erros.email = "Digite um e-mail válido, como nome@email.com.";
    }

    if (!ASSUNTOS.includes(valores.assunto)) {
        erros.assunto = "Escolha um assunto.";
    }

    if (!valores.mensagem) {
        erros.mensagem = "Escreva sua mensagem.";
    } else if (valores.mensagem.length < LIMITES.mensagemMin) {
        erros.mensagem = `A mensagem precisa ter pelo menos ${LIMITES.mensagemMin} caracteres.`;
    } else if (valores.mensagem.length > LIMITES.mensagemMax) {
        erros.mensagem = `A mensagem pode ter no máximo ${LIMITES.mensagemMax} caracteres.`;
    }

    return { valores, erros };
};

const registrar = async (data = {}) => {
    // Campo isca: pessoas não o veem. Se veio preenchido, é robô — finge sucesso e descarta.
    if (data.website) return { descartado: true };

    const { valores, erros } = validar(data);
    if (Object.keys(erros).length) throw new ErroValidacao(erros);

    await prisma.contato.create({
        data: {
            nome: valores.nome,
            email: valores.email,
            assunto: valores.assunto,
            mensagem: valores.mensagem
        }
    });

    return { descartado: false };
};

const listar = async () => {
    const lista = await prisma.contato.findMany({
        orderBy: { criadaEm: "desc" },
        take: 200
    });

    return lista;
};

module.exports = {
    registrar,
    listar,
    validar,
    ErroValidacao,
    ASSUNTOS
};
