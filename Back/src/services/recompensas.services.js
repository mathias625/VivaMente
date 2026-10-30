const prisma = require("../data/prisma");

const validarId = id => {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) throw new Error("ID inválido");
    return n;
};

const cadastrar = async (dados, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem cadastrar recompensas");
    const preco = Number(dados.preco);
    if (!dados.nome || !Number.isInteger(preco) || preco <= 0) {
        throw new Error("Informe um nome e um preço válido maior que zero");
    }
    return prisma.recompensa.create({
        data: { nome: dados.nome, descricao: dados.descricao || "", preco }
    });
};

const listar = () => prisma.recompensa.findMany({ orderBy: { id: "desc" } });

const buscar = async id => {
    const recompensa = await prisma.recompensa.findUnique({
        where: { id: validarId(id) }
    });
    if (!recompensa) throw new Error("Recompensa não encontrada");
    return recompensa;
};

const atualizar = async (id, dados, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem atualizar recompensas");
    const permitidos = {};
    if (dados.nome !== undefined) permitidos.nome = dados.nome;
    if (dados.descricao !== undefined) permitidos.descricao = dados.descricao;
    if (dados.preco !== undefined) {
        const preco = Number(dados.preco);
        if (!Number.isInteger(preco) || preco <= 0) throw new Error("Preço inválido");
        permitidos.preco = preco;
    }
    return prisma.recompensa.update({ where: { id: validarId(id) }, data: permitidos });
};

const excluir = async (id, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem excluir recompensas");
    return prisma.recompensa.delete({ where: { id: validarId(id) } });
};

const comprar = async (id, usuario) => {
    if (usuario.tipo !== "paciente") throw new Error("Apenas pacientes podem resgatar recompensas");
    const recompensaId = validarId(id);

    return prisma.$transaction(async tx => {
        const recompensa = await tx.recompensa.findUnique({ where: { id: recompensaId } });
        if (!recompensa) throw new Error("Recompensa não encontrada");

        const paciente = await tx.paciente.findUnique({
            where: { id: usuario.id },
            select: { id: true, pontos: true }
        });
        if (!paciente) throw new Error("Paciente não encontrado");
        if (paciente.pontos < recompensa.preco) throw new Error("Pontos insuficientes");

        const atualizado = await tx.paciente.update({
            where: { id: paciente.id },
            data: { pontos: { decrement: recompensa.preco } },
            select: { id: true, pontos: true }
        });

        return {
            mensagem: "Recompensa resgatada com sucesso",
            recompensa,
            pontosRestantes: atualizado.pontos
        };
    });
};

module.exports = { cadastrar, listar, buscar, atualizar, excluir, comprar };
