const prisma = require("../data/prisma");

const validarId = (id) => {
    const n = Number(id);

    if (!Number.isInteger(n) || n <= 0) {
        throw new Error("ID inválido");
    }

    return n;
};

const criarConversa = async (usuario) => {
    if (usuario.tipo !== "paciente") {
        throw new Error("Apenas pacientes podem criar conversas");
    }

    return prisma.conversa.create({
        data: {
            pacienteId: usuario.id
        }
    });
};

const listarConversas = async (usuario) => {
    if (usuario.tipo !== "paciente") {
        throw new Error("Apenas pacientes podem listar conversas");
    }

    return prisma.conversa.findMany({
        where: {
            pacienteId: usuario.id
        },
        orderBy: {
            criadaEm: "desc"
        }
    });
};

const buscarConversa = async (id, usuario) => {
    const conversa = await prisma.conversa.findUnique({
        where: {
            id: validarId(id)
        },
        include: {
            mensagens: {
                orderBy: {
                    criadaEm: "asc"
                }
            }
        }
    });

    if (!conversa) {
        throw new Error("Conversa não encontrada");
    }

    if (conversa.pacienteId !== usuario.id) {
        throw new Error("Acesso negado");
    }

    return conversa;
};

const enviarMensagem = async (id, texto, usuario) => {
    if (usuario.tipo !== "paciente") {
        throw new Error("Apenas pacientes podem enviar mensagens");
    }

    if (!texto || !texto.trim()) {
        throw new Error("Mensagem não informada");
    }

    const conversa = await buscarConversa(id, usuario);

    await prisma.mensagem.create({
        data: {
            conversaId: conversa.id,
            tipo: "usuario",
            texto: texto
        }
    });

    const historico = conversa.mensagens.map((mensagem) => {
        return `${mensagem.tipo === "usuario" ? "Usuário" : "IA"}: ${mensagem.texto}`;
    }).join("\n");

    const prompt = `
Você é uma IA de apoio emocional chamada Toquinho dentro de um sistema de saúde mental.

Seu objetivo é conversar de maneira acolhedora, respeitosa e responsável.

REGRAS DE ACOLHIMENTO:

- Seja acolhedor, respeitoso e não julgador.
- Não se apresente como psicólogo, médico ou profissional de saúde.
- Você pode ajudar o usuário a organizar pensamentos e sentimentos, mas não substitui acompanhamento profissional.

- Se o usuário estiver apenas desabafando ou passando por um momento difícil, converse normalmente e faça perguntas abertas e acolhedoras.

- Se a conversa estiver ficando muito longa ou o usuário demonstrar que precisa de um tempo, você pode sugerir uma pausa de forma natural, por exemplo:
  "Talvez seja um bom momento para respirar um pouco e continuar essa conversa mais tarde. Quando você se sentir preparado, podemos continuar por aqui."

- Se o usuário apresentar uma situação que exige avaliação ou acompanhamento profissional, recomende conversar com um psicólogo, médico ou outro profissional adequado. Não faça diagnósticos.

- Nesses casos, use uma linguagem como:
  "O que você está sentindo parece importante e pode ser útil conversar sobre isso com um profissional da área. Um psicólogo pode te ajudar a entender melhor essa situação e encontrar formas de lidar com ela."

- Não diga que o usuário "precisa" de um diagnóstico ou que possui determinada doença.

- Se houver sinais de que a pessoa está em perigo imediato ou não consegue se manter segura, priorize orientar a pessoa a procurar imediatamente um adulto de confiança, serviço de emergência local ou outro suporte presencial disponível, em vez de tentar resolver a situação apenas pelo chat.

Quando uma pessoa demonstrar sofrimento intenso ou risco de machucar a si mesma ou outra pessoa, incentive a busca imediata por ajuda humana e serviços de emergência apropriados.

Histórico da conversa:
${historico}

Nova mensagem do usuário:
${texto}

Responda de forma natural, acolhedora e objetiva.
`;

    let resposta;

    for (let tentativa = 1; tentativa <= 3; tentativa++) {
        try {
            const respostaOpenRouter = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "openrouter/free",
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ]
                    })
                }
            );

            const dados = await respostaOpenRouter.json();

            if (!respostaOpenRouter.ok) {
                const erro = new Error(
                    dados.error?.message || "Erro ao chamar o OpenRouter"
                );

                erro.status = respostaOpenRouter.status;

                throw erro;
            }

            resposta = dados.choices[0].message.content;

            break;
        } catch (error) {
            if (tentativa === 3) {
                throw error;
            }

            if (error.status !== 503 && error.status !== 429) {
                throw error;
            }

            await new Promise((resolve) => {
                setTimeout(resolve, tentativa * 2000);
            });
        }
    }

    await prisma.mensagem.create({
        data: {
            conversaId: conversa.id,
            tipo: "ia",
            texto: resposta
        }
    });

    return {
        resposta
    };
};

const excluirConversa = async (id, usuario) => {
    const conversa = await buscarConversa(id, usuario);

    await prisma.mensagem.deleteMany({
        where: {
            conversaId: conversa.id
        }
    });

    return prisma.conversa.delete({
        where: {
            id: conversa.id
        }
    });
};

module.exports = {
    criarConversa,
    listarConversas,
    buscarConversa,
    enviarMensagem,
    excluirConversa
};