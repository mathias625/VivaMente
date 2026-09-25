const prisma = require("../data/prisma");

const validarIds = (id) => {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) throw new Error("ID inválido");
    return n;
};

const cadastrar = async (data, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem criar consultas");
    return prisma.consulta.create({
        data: {
            data: new Date(data.data),
            psicologoId: validarIds(data.psicologoId),
            pacienteId: validarIds(data.pacienteId)
        }
    }
    );
};

const listar = async (usuario) => {
    if (usuario.tipo === "psicologo") return prisma.consulta.findMany({
        where: { psicologoId: usuario.id },
        include: {
            paciente: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            }
        }
    }
    );
    return prisma.consulta.findMany({
        where: { pacienteId: usuario.id },
        include: {
            psicologo: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            }
        }
    });
};

const buscar = async (id, usuario) => {
    const item = await prisma.consulta.findUnique({
        where: { id: validarIds(id) },
        include: {
            psicologo: true,
            paciente: true
        }
    });

    if (!item) throw new Error("Consulta não encontrada");
    if (usuario.tipo === "psicologo" && item.psicologoId !== usuario.id) throw new Error("Acesso negado");
    if (usuario.tipo === "paciente" && item.pacienteId !== usuario.id) throw new Error("Acesso negado");
    return item;
};

const atualizar = async (id, data, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem atualizar consultas");
    const item = await buscar(id, usuario);
    return prisma.consulta.update({
        where: { id: item.id },
        data: {
            ...(data.data ? {
                data: new Date(data.data)
            }
                : {
                }
            ), ...(data.pacienteId ? {
                pacienteId: validarIds(data.pacienteId)
            }
                : {
                }
            ), ...(data.psicologoId ? {
                psicologoId: validarIds(data.psicologoId)
            }
                : {
                }
            )
        }
    }
    );
};

const excluir = async (id, usuario) => {
    if (usuario.tipo !== "psicologo") throw new Error("Apenas psicólogos podem excluir consultas");
    await buscar(id, usuario);
    return prisma.consulta.delete({
        where: { id: validarIds(id) }
    }
    );
};

module.exports = {
    cadastrar, 
    listar, 
    buscar, 
    atualizar, 
    excluir
};