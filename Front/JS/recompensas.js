let recompensas = [];
let saldo = 0;
const ehPsicologo = () => Sessao.usuario.tipo === "psicologo";

async function iniciarRecompensas() {
    if (ehPsicologo()) {
        document.getElementById("recompensas-descricao").textContent =
            "Gerencie as recompensas que seus pacientes podem resgatar com pontos.";
    }
    try {
        recompensas = await api("/recompensas/listar");
        saldo = (await atualizarPontos()) ?? 0;
        renderizar();
    } catch (e) {
        toast(e.message, "erro");
    }
}

function renderizar() {
    const grid = document.getElementById("lista-recompensas");
    if (!recompensas.length) {
        grid.innerHTML = `<div class="vazio">${ehPsicologo()
            ? "Nenhuma recompensa cadastrada. Use <strong>+ Nova recompensa</strong> para criar a primeira."
            : "Ainda não há recompensas disponíveis. Volte em breve!"}</div>`;
        return;
    }
    grid.innerHTML = recompensas.map(r => {
        const acoes = ehPsicologo()
            ? `<button class="btn-excluir" data-acao="excluir" data-id="${r.id}">Excluir</button>`
            : `<button class="btn-concluir" data-acao="comprar" data-id="${r.id}"
                    ${saldo < r.preco ? "disabled title=\"Pontos insuficientes\"" : ""}>
                    ${saldo < r.preco ? "Pontos insuficientes" : "Resgatar"}</button>`;
        return `
            <article class="tarefa" id="recompensa-${r.id}">
                <div class="tarefa-icon">🎁</div>
                <div class="tarefa-conteudo">
                    <span class="categoria">${esc(r.preco)} pontos</span>
                    <h3>${esc(r.nome)}</h3>
                    <p>${esc(r.descricao)}</p>
                </div>
                <div class="tarefa-acoes">${acoes}</div>
            </article>`;
    }).join("");
}

document.getElementById("lista-recompensas").addEventListener("click", async e => {
    const botao = e.target.closest("button[data-acao]");
    if (!botao) return;
    const id = Number(botao.dataset.id);
    const r = recompensas.find(x => x.id === id);
    if (!r) return;

    botao.disabled = true;
    try {
        if (botao.dataset.acao === "comprar") {
            if (!confirm(`Resgatar "${r.nome}" por ${r.preco} pontos?`)) { botao.disabled = false; return; }
            const res = await api("/recompensas/comprar/" + id, { metodo: "POST" });
            saldo = res.pontosRestantes;
            document.querySelectorAll(".pontos-valor").forEach(el => { el.textContent = saldo; });
            toast(`"${r.nome}" resgatada com sucesso!`);
            renderizar();
        } else if (botao.dataset.acao === "excluir") {
            if (!confirm(`Excluir a recompensa "${r.nome}"?`)) { botao.disabled = false; return; }
            await api("/recompensas/excluir/" + id, { metodo: "DELETE" });
            recompensas = recompensas.filter(x => x.id !== id);
            toast("Recompensa excluída.");
            renderizar();
        }
    } catch (err) {
        toast(err.message, "erro");
        botao.disabled = false;
    }
});

document.getElementById("btn-nova-recompensa").addEventListener("click", async () => {
    const v = await formularioModal("Nova recompensa", [
        { id: "nome", label: "Nome", obrigatorio: true },
        { id: "descricao", label: "Descrição", tipo: "textarea" },
        { id: "preco", label: "Preço em pontos", tipo: "number", min: 1, valor: 50, obrigatorio: true }
    ], "Criar recompensa");
    if (!v) return;
    try {
        const nova = await api("/recompensas/cadastrar", {
            metodo: "POST",
            corpo: { nome: v.nome, descricao: v.descricao, preco: Number(v.preco) }
        });
        recompensas.push(nova);
        renderizar();
        toast("Recompensa criada!");
    } catch (err) {
        toast(err.message, "erro");
    }
});

/* ---------- Início (depois de declarar tudo) ---------- */
if (exigirLogin()) iniciarRecompensas();
