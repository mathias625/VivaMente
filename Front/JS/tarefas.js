let pronto = Promise.resolve();
let tarefas = [];
let pacientes = [];
const ehPsicologo = () => Sessao.usuario.tipo === "psicologo";
const concluida = t => t.status === "concluida";

async function iniciarTarefas() {
    if (ehPsicologo()) {
        document.getElementById("titulo-label").textContent = "Acompanhamento";
        document.getElementById("titulo-pagina").textContent = "Tarefas dos Pacientes";
        document.getElementById("titulo-descricao").textContent =
            "Atribua tarefas e acompanhe o progresso de cada paciente.";
        document.getElementById("lista-label").textContent = "Tarefas";
        document.getElementById("lista-titulo").textContent = "Atribuídas por você";
    }
    try {
        if (ehPsicologo()) await carregarPacientes();
        await carregarTarefas();
        await atualizarPontos();
    } catch (e) {
        toast(e.message, "erro");
    }
}

async function carregarPacientes() {
    pacientes = await api("/psicologo/meus-pacientes");
    const filtro = document.getElementById("filtro-paciente");
    filtro.innerHTML = `<option value="">Todos os pacientes</option>` +
        pacientes.map(p => `<option value="${esc(p.id)}">${esc(p.nome)}</option>`).join("");
}

async function carregarTarefas() {
    tarefas = await api("/tarefas/listar");
    renderizar();
}

function nomePaciente(id) {
    const p = pacientes.find(x => x.id === id);
    return p ? p.nome : "Paciente #" + id;
}

function renderizar() {
    const filtro = document.getElementById("filtro-paciente").value;
    const visiveis = ehPsicologo() && filtro
        ? tarefas.filter(t => String(t.pacienteId) === filtro)
        : tarefas;

    const grid = document.getElementById("lista-tarefas");
    if (!visiveis.length) {
        grid.innerHTML = `<div class="vazio">${ehPsicologo()
            ? "Nenhuma tarefa por aqui. Use <strong>+ Nova tarefa</strong> para atribuir uma a um paciente."
            : "Você ainda não tem tarefas. Elas aparecerão aqui assim que seu psicólogo(a) cadastrar."}</div>`;
    } else {
        grid.innerHTML = visiveis.map(cartao).join("");
    }
    atualizarProgresso(visiveis);
}

function cartao(t) {
    const feita = concluida(t);
    const categoria = ehPsicologo()
        ? `${esc(nomePaciente(t.pacienteId))} · +${esc(t.pontos)} pts`
        : `+${esc(t.pontos)} pontos`;

    const acoes = ehPsicologo()
        ? `<span class="status-tag">${feita ? "Concluída" : esc(t.status)}</span>
           <button class="btn-excluir" data-acao="excluir" data-id="${t.id}">Excluir</button>`
        : `<button class="btn-concluir" data-acao="alternar" data-id="${t.id}"
                title="${feita ? "Clique para desfazer" : "Marcar como concluída"}">
                ${feita ? "✓ Concluída" : "Concluir"}</button>`;

    return `
        <article class="tarefa ${feita ? "concluida" : ""}" id="tarefa-${t.id}">
            <div class="tarefa-icon">${feita ? "✅" : "📝"}</div>
            <div class="tarefa-conteudo">
                <span class="categoria">${categoria}</span>
                <h3>${esc(t.nome)}</h3>
                <p>${esc(t.descricao)}</p>
            </div>
            <div class="tarefa-acoes">${acoes}</div>
        </article>`;
}

function atualizarProgresso(lista) {
    const total = lista.length;
    const feitas = lista.filter(concluida).length;
    const porcentagem = total ? Math.round((feitas / total) * 100) : 0;
    document.getElementById("porcentagem").textContent = porcentagem + "%";
    document.getElementById("progresso-texto").textContent =
        `${feitas} de ${total} ${total === 1 ? "tarefa concluída" : "tarefas concluídas"}`;
    document.getElementById("barra-progresso").style.width = porcentagem + "%";
}

/* ---------- Ações nos cartões ---------- */
document.getElementById("lista-tarefas").addEventListener("click", async e => {
    const botao = e.target.closest("button[data-acao]");
    if (!botao) return;
    const id = Number(botao.dataset.id);
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;

    botao.disabled = true;
    try {
        if (botao.dataset.acao === "alternar") {
            const novo = concluida(tarefa) ? "pendente" : "concluida";
            const atualizada = await api("/tarefas/atualizar/" + id, {
                metodo: "PUT",
                corpo: { status: novo }
            });
            tarefa.status = atualizada.status;
            toast(novo === "concluida"
                ? `Tarefa concluída! +${tarefa.pontos} pontos`
                : "Tarefa reaberta. Pontos estornados.");
            renderizar();
            await atualizarPontos();
        } else if (botao.dataset.acao === "excluir") {
            if (!confirm(`Excluir a tarefa "${tarefa.nome}"?`)) { botao.disabled = false; return; }
            await api("/tarefas/excluir/" + id, { metodo: "DELETE" });
            tarefas = tarefas.filter(t => t.id !== id);
            toast("Tarefa excluída.");
            renderizar();
        }
    } catch (err) {
        toast(err.message, "erro");
        botao.disabled = false;
    }
});

/* ---------- Nova tarefa (psicólogo) ---------- */
document.getElementById("btn-nova-tarefa").addEventListener("click", async () => {
    await pronto;
    if (!pacientes.length) {
        return toast("Cadastre um paciente no seu perfil antes de criar tarefas.", "erro");
    }
    const filtro = document.getElementById("filtro-paciente").value;
    const v = await formularioModal("Nova tarefa", [
        {
            id: "pacienteId", label: "Paciente", tipo: "select", valor: filtro,
            opcoes: pacientes.map(p => ({ valor: p.id, texto: p.nome }))
        },
        { id: "nome", label: "Título da tarefa", obrigatorio: true },
        { id: "descricao", label: "Descrição", tipo: "textarea" },
        { id: "pontos", label: "Pontos ao concluir", tipo: "number", valor: 10, min: 0, obrigatorio: true }
    ], "Criar tarefa");
    if (!v) return;

    try {
        const nova = await api("/tarefas/cadastrar", {
            metodo: "POST",
            corpo: {
                nome: v.nome,
                descricao: v.descricao,
                pontos: Number(v.pontos),
                pacienteId: Number(v.pacienteId),
                status: "pendente"
            }
        });
        tarefas.push(nova);
        renderizar();
        toast("Tarefa criada!");
    } catch (err) {
        toast(err.message, "erro");
    }
});

document.getElementById("filtro-paciente").addEventListener("change", renderizar);

/* ---------- Check-in (paciente) ---------- */
document.getElementById("btn-checkin").addEventListener("click", async () => {
    try {
        await api("/paciente/checkin", { metodo: "POST" });
        toast("Check-in registrado! +10 pontos");
        await atualizarPontos();
    } catch (err) {
        toast(err.message, "erro");
    }
});

/* ---------- Início (depois de declarar tudo) ---------- */
if (exigirLogin()) pronto = iniciarTarefas();
