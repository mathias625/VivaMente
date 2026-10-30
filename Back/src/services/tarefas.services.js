const prisma = require("../data/prisma");

const validarId = (valor, campo = "ID") => {
    const n = Number(valor);
    if (!Number.isInteger(n) || n <= 0) throw new Error(`${campo} inválido`);
    return n;
};

const cadastrar = async (data, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem criar tarefas");
    if (!data.nome) throw new Error("O nome da tarefa é obrigatório");

    const pacienteId = validarId(data.pacienteId, "Paciente");
    const paciente = await prisma.paciente.findFirst({
        where: { id: pacienteId, psicologoId: usuario.id },
        select: { id: true }
    });
    if (!paciente) throw new Error("Paciente não encontrado ou não pertence a você");

    return prisma.tarefa.create({
        data: {
            nome: data.nome,
            descricao: data.descricao || "",
            status: "pendente",
            pontos: Math.max(0, Number(data.pontos) || 0),
            pacienteId
        }
    });
};

const listar = async usuario => prisma.tarefa.findMany({
    where: usuario.tipo === "psicologo"
        ? { paciente: { psicologoId: usuario.id } }
        : { pacienteId: usuario.id },
    orderBy: { id: "desc" }
});

const buscar = async (id, usuario) => {
    const tarefa = await prisma.tarefa.findUnique({ where: { id: validarId(id, "Tarefa") } });
    if (!tarefa) throw new Error("Tarefa não encontrada");

    if (usuario.tipo === "paciente" && tarefa.pacienteId !== usuario.id) {
        throw new Error("Acesso negado");
    }
    if (usuario.tipo === "psicologo") {
        const paciente = await prisma.paciente.findFirst({
            where: { id: tarefa.pacienteId, psicologoId: usuario.id },
            select: { id: true }
        });
        if (!paciente) throw new Error("Acesso negado");
    }
    return tarefa;
};

const atualizar = async (id, data, usuario) => {
    const tarefa = await buscar(id, usuario);

    if (usuario.tipo === "paciente") {
        if (Object.keys(data).some(campo => campo !== "status")) {
            throw new Error("Paciente só pode atualizar o status da tarefa");
        }
        if (!["pendente", "concluida"].includes(data.status)) {
            throw new Error("Status inválido");
        }

        return prisma.$transaction(async tx => {
            const atualizada = await tx.tarefa.update({
                where: { id: tarefa.id },
                data: { status: data.status }
            });

            if (tarefa.status !== "concluida" && data.status === "concluida") {
                await tx.paciente.update({
                    where: { id: tarefa.pacienteId },
                    data: { pontos: { increment: tarefa.pontos } }
                });
            } else if (tarefa.status === "concluida" && data.status !== "concluida") {
                await tx.paciente.update({
                    where: { id: tarefa.pacienteId },
                    data: { pontos: { decrement: tarefa.pontos } }
                });
            }
            return atualizada;
        });
    }

    const dadosPermitidos = {};
    if (data.nome !== undefined) dadosPermitidos.nome = data.nome;
    if (data.descricao !== undefined) dadosPermitidos.descricao = data.descricao;
    if (data.status !== undefined) {
        if (!["pendente", "concluida"].includes(data.status)) throw new Error("Status inválido");
        dadosPermitidos.status = data.status;
    }
    if (data.pontos !== undefined) dadosPermitidos.pontos = Math.max(0, Number(data.pontos));

    if (data.pacienteId !== undefined) {
        const pacienteId = validarId(data.pacienteId, "Paciente");
        const paciente = await prisma.paciente.findFirst({
            where: { id: pacienteId, psicologoId: usuario.id }, select: { id: true }
        });
        if (!paciente) throw new Error("Paciente não encontrado ou não pertence a você");
        dadosPermitidos.pacienteId = pacienteId;
    }

    return prisma.tarefa.update({ where: { id: tarefa.id }, data: dadosPermitidos });
};

const excluir = async (id, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem excluir tarefas");
    const tarefa = await buscar(id, usuario);
    return prisma.tarefa.delete({ where: { id: tarefa.id } });
};

module.exports = { cadastrar, listar, buscar, atualizar, excluir };
