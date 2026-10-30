let pronto = Promise.resolve();
let consultas = [];
let pacientes = [];
let meuPsicologo = null;
const ehPsicologo = () => Sessao.usuario.tipo === "psicologo";

async function iniciarConsultas() {
    try {
        if (ehPsicologo()) {
            document.getElementById("consultas-descricao").textContent =
                "Agende e gerencie as sessões com seus pacientes.";
            pacientes = await api("/psicologo/meus-pacientes");
        } else {
            meuPsicologo = await api("/paciente/meu-psicologo");
        }
        await carregarConsultas();
    } catch (e) {
        toast(e.message, "erro");
    }
}

async function carregarConsultas() {
    consultas = (await api("/consulta/listar"))
        .sort((a, b) => new Date(a.data) - new Date(b.data));
    renderizar();
}

/* A API devolve o nome do outro participante criptografado em /consulta,
   então ele é resolvido a partir das rotas que já devolvem o nome legível. */
function nomeDaConsulta(c) {
    if (ehPsicologo()) {
        const p = pacientes.find(x => x.id === c.pacienteId);
        return p ? p.nome : "Paciente #" + c.pacienteId;
    }
    return meuPsicologo ? meuPsicologo.nome : "Psicólogo(a)";
}

function renderizar() {
    const grid = document.getElementById("lista-consultas");
    if (!consultas.length) {
        grid.innerHTML = `<div class="vazio">${ehPsicologo()
            ? "Nenhuma consulta agendada. Use <strong>+ Nova consulta</strong> para marcar uma sessão."
            : "Você ainda não tem consultas agendadas."}</div>`;
        return;
    }
    const agora = Date.now();
    grid.innerHTML = consultas.map(c => {
        const passada = new Date(c.data).getTime() < agora;
        const acoes = ehPsicologo()
            ? `<button class="btn-concluir" data-acao="reagendar" data-id="${c.id}">Reagendar</button>
               <button class="btn-excluir" data-acao="excluir" data-id="${c.id}">Excluir</button>`
            : `<span class="status-tag">${passada ? "Realizada" : "Agendada"}</span>`;
        return `
            <article class="tarefa ${passada ? "passada" : ""}" id="consulta-${c.id}">
                <div class="tarefa-icon">📅</div>
                <div class="tarefa-conteudo">
                    <span class="categoria">${passada ? "Realizada" : "Agendada"}</span>
                    <h3>${ehPsicologo() ? "Sessão com " : "Consulta com "}${esc(nomeDaConsulta(c))}</h3>
                    <p>${esc(formatarData(c.data))}</p>
                </div>
                <div class="tarefa-acoes">${acoes}</div>
            </article>`;
    }).join("");
}

document.getElementById("lista-consultas").addEventListener("click", async e => {
    const botao = e.target.closest("button[data-acao]");
    if (!botao) return;
    const id = Number(botao.dataset.id);
    const c = consultas.find(x => x.id === id);
    if (!c) return;

    try {
        if (botao.dataset.acao === "excluir") {
            if (!confirm("Excluir esta consulta?")) return;
            await api("/consulta/excluir/" + id, { metodo: "DELETE" });
            consultas = consultas.filter(x => x.id !== id);
            toast("Consulta excluída.");
            renderizar();
        } else if (botao.dataset.acao === "reagendar") {
            const v = await formularioModal("Reagendar consulta", [
                { id: "data", label: "Nova data e horário", tipo: "datetime-local", valor: paraInputDataHora(c.data), obrigatorio: true }
            ], "Reagendar");
            if (!v) return;
            await api("/consulta/atualizar/" + id, {
                metodo: "PUT",
                corpo: { data: new Date(v.data).toISOString() }
            });
            toast("Consulta reagendada!");
            await carregarConsultas();
        }
    } catch (err) {
        toast(err.message, "erro");
    }
});

document.getElementById("btn-nova-consulta").addEventListener("click", async () => {
    await pronto;
    if (!pacientes.length) {
        return toast("Cadastre um paciente no seu perfil antes de agendar.", "erro");
    }
    const v = await formularioModal("Nova consulta", [
        {
            id: "pacienteId", label: "Paciente", tipo: "select",
            opcoes: pacientes.map(p => ({ valor: p.id, texto: p.nome }))
        },
        { id: "data", label: "Data e horário", tipo: "datetime-local", obrigatorio: true }
    ], "Agendar");
    if (!v) return;
    try {
        await api("/consulta/cadastrar", {
            metodo: "POST",
            corpo: {
                data: new Date(v.data).toISOString(),
                pacienteId: Number(v.pacienteId)
            }
        });
        toast("Consulta agendada!");
        await carregarConsultas();
    } catch (err) {
        toast(err.message, "erro");
    }
});

/* ---------- Início (depois de declarar tudo) ---------- */
if (exigirLogin()) pronto = iniciarConsultas();
