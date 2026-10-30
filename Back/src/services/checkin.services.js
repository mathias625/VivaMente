const prisma = require("../data/prisma");

const PONTOS_CHECKIN = 10;
const FUSO_HORARIO = "America/Sao_Paulo";

function obterDiaAtual() {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: FUSO_HORARIO,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const valores = Object.fromEntries(partes.map(parte => [parte.type, parte.value]));
    return new Date(Date.UTC(
        Number(valores.year),
        Number(valores.month) - 1,
        Number(valores.day)
    ));
}

async function consultar(usuario) {
    if (usuario.tipo !== "paciente") {
        throw new Error("Somente pacientes podem fazer check-in");
    }

    const dia = obterDiaAtual();
    const registro = await prisma.checkin.findUnique({
        where: { pacienteId_dia: { pacienteId: usuario.id, dia } }
    });

    return {
        feito: Boolean(registro),
        pontos: PONTOS_CHECKIN,
        data: registro ? registro.data : null
    };
}

async function registrar(usuario) {
    if (usuario.tipo !== "paciente") {
        throw new Error("Somente pacientes podem fazer check-in");
    }

    const dia = obterDiaAtual();

    try {
        return await prisma.$transaction(async tx => {
            // A data é definida no momento em que o servidor recebe a conclusão.
            const registro = await tx.checkin.create({
                data: {
                    pacienteId: usuario.id,
                    dia,
                    data: new Date()
                }
            });

            const paciente = await tx.paciente.update({
                where: { id: usuario.id },
                data: { pontos: { increment: PONTOS_CHECKIN } },
                select: { pontos: true }
            });

            return {
                mensagem: "Check-in registrado!",
                feito: true,
                pontosAdicionados: PONTOS_CHECKIN,
                pontos: paciente.pontos,
                data: registro.data
            };
        });
    } catch (erro) {
        if (erro.code === "P2002") {
            throw new Error("Você já fez seu check-in de hoje");
        }
        throw erro;
    }
}

module.exports = { consultar, registrar };
