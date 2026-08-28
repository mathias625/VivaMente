const prisma = require("../data/prisma");

const cadastrar = async (data, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem criar tarefas");
    return prisma.tarefas.create({
        data: {
            nome: data.nome, descricao: data.descricao || "", status: data.status || "pendente", pontos: Number(data.pontos || 0), pacienteId: Number(data.pacienteId)
        }
    });
};

const listar = async usuario => prisma.tarefas.findMany({
    where: usuario.tipo === 'psicologo' ? {
        paciente: { psicologoId: usuario.id }
    }
        : { pacienteId: usuario.id }
});

const buscar = async (id, usuario) => {
    const t = await prisma.tarefas.findUnique({
        where: { id: Number(id) }
    });
    if (!t) throw new Error("Tarefa não encontrada");
    if (usuario.tipo === 'paciente' && t.pacienteId !== usuario.id) throw new Error("Acesso negado");
    if (usuario.tipo === 'psicologo') {
        const p = await prisma.paciente.findUnique({
            where: { id: t.pacienteId }
            , select: { psicologoId: true }
        });
        if (!p || p.psicologoId !== usuario.id) throw new Error("Acesso negado");
    }
    return t;
};

const atualizar = async (id, data, usuario) => {
    const t = await buscar(id, usuario);
    if (usuario.tipo === 'paciente') {
        if (Object.keys(data).some(k => k !== "status")) throw new Error("Paciente só pode atualizar o status da tarefa");
        if (!data.status) throw new Error("Status é obrigatório");
        return prisma.$transaction(async tx => {
            const atualizado = await tx.tarefas.update({
                where: { id: t.id },
                data: { status: data.status }
            });

            if (t.status !== "concluida" && data.status === "concluida") await tx.paciente.update({
                where: { id: t.pacienteId },
                data: { pontos: { increment: t.pontos } }
            });

            if (t.status === "concluida" && data.status !== "concluida") await tx.paciente.update({
                where: { id: t.pacienteId },
                data: { pontos: { decrement: t.pontos } }
            });

            return atualizado;
        });
    }

    if (data.pacienteId) data.pacienteId = Number(data.pacienteId);
    if (data.pontos !== undefined) data.pontos = Number(data.pontos);

    return prisma.tarefas.update({
        where: { id: t.id },
        data
    });
};

const excluir = async (id, usuario) => {
    if (usuario.tipo !== 'psicologo') throw new Error("Apenas psicólogos podem excluir tarefas");
    await buscar(id, usuario);
    return prisma.tarefas.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    cadastrar, listar, buscar, atualizar, excluir
}
    ;
