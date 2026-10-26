const prisma = require("../data/prisma");

const cadastrar = async (data, usuario) => {
    if (usuario.tipo !== "psicologo") {
        throw new Error("Apenas psicólogos podem criar tarefas");
    }

    const pacienteId = Number(data.pacienteId);

    const paciente = await prisma.paciente.findUnique({
        where: {
            id: pacienteId
        },
        select: {
            id: true,
            psicologoId: true
        }
    });

    if (!paciente) {
        throw new Error("Paciente não encontrado");
    }

    if (paciente.psicologoId !== usuario.id) {
        throw new Error("Paciente não pertence a este psicólogo");
    }

    return prisma.tarefa.create({
        data: {
            nome: data.nome,
            descricao: data.descricao || "",
            status: data.status || "pendente",
            pontos: Number(data.pontos || 0),
            pacienteId
        }
    });
};

const listar = async (usuario) => {
    if (usuario.tipo === "psicologo") {
        return prisma.tarefa.findMany({
            where: {
                paciente: {
                    psicologoId: usuario.id
                }
            },
            orderBy: {
                id: "asc"
            }
        });
    }

    return prisma.tarefa.findMany({
        where: {
            pacienteId: usuario.id
        },
        orderBy: {
            id: "asc"
        }
    });
};

const buscar = async (id, usuario) => {
    const tarefa = await prisma.tarefa.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!tarefa) {
        throw new Error("Tarefa não encontrada");
    }

    if (
        usuario.tipo === "paciente" &&
        tarefa.pacienteId !== usuario.id
    ) {
        throw new Error("Acesso negado");
    }

    if (usuario.tipo === "psicologo") {
        const paciente = await prisma.paciente.findUnique({
            where: {
                id: tarefa.pacienteId
            },
            select: {
                psicologoId: true
            }
        });

        if (!paciente || paciente.psicologoId !== usuario.id) {
            throw new Error("Acesso negado");
        }
    }

    return tarefa;
};

const atualizar = async (id, data, usuario) => {
    const tarefa = await buscar(id, usuario);

    if (usuario.tipo === "paciente") {
        if (
            Object.keys(data).some(
                chave => chave !== "status"
            )
        ) {
            throw new Error(
                "Paciente só pode atualizar o status da tarefa"
            );
        }

        if (!data.status) {
            throw new Error("Status é obrigatório");
        }

        if (
            data.status !== "pendente" &&
            data.status !== "concluida"
        ) {
            throw new Error("Status inválido");
        }

        return prisma.$transaction(async tx => {
            const atualizado = await tx.tarefa.update({
                where: {
                    id: tarefa.id
                },
                data: {
                    status: data.status
                }
            });

            if (
                tarefa.status !== "concluida" &&
                data.status === "concluida"
            ) {
                await tx.paciente.update({
                    where: {
                        id: tarefa.pacienteId
                    },
                    data: {
                        pontos: {
                            increment: tarefa.pontos
                        }
                    }
                });
            }

            if (
                tarefa.status === "concluida" &&
                data.status !== "concluida"
            ) {
                await tx.paciente.update({
                    where: {
                        id: tarefa.pacienteId
                    },
                    data: {
                        pontos: {
                            decrement: tarefa.pontos
                        }
                    }
                });
            }

            return atualizado;
        });
    }

    const dadosAtualizacao = {};

    if (data.nome !== undefined) {
        dadosAtualizacao.nome = data.nome;
    }

    if (data.descricao !== undefined) {
        dadosAtualizacao.descricao = data.descricao;
    }

    if (data.status !== undefined) {
        dadosAtualizacao.status = data.status;
    }

    if (data.pontos !== undefined) {
        dadosAtualizacao.pontos = Number(data.pontos);
    }

    if (data.pacienteId !== undefined) {
        const novoPacienteId = Number(data.pacienteId);

        const paciente = await prisma.paciente.findUnique({
            where: {
                id: novoPacienteId
            },
            select: {
                id: true,
                psicologoId: true
            }
        });

        if (!paciente) {
            throw new Error("Paciente não encontrado");
        }

        if (paciente.psicologoId !== usuario.id) {
            throw new Error("Paciente não pertence a este psicólogo");
        }

        dadosAtualizacao.pacienteId = novoPacienteId;
    }

    return prisma.tarefa.update({
        where: {
            id: tarefa.id
        },
        data: dadosAtualizacao
    });
};

const excluir = async (id, usuario) => {
    if (usuario.tipo !== "psicologo") {
        throw new Error("Apenas psicólogos podem excluir tarefas");
    }

    await buscar(id, usuario);

    return prisma.tarefa.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};