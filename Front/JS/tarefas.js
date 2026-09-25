let concluidas = 0;
const totalTarefas = 6;

function concluirTarefa(botao) {
    const tarefa = botao.closest(".tarefa");
    if (tarefa.classList.contains("concluida")) {
        return;
    }
    tarefa.classList.add("concluida");
    botao.textContent = "✓ Concluída";
    botao.disabled = true;
    concluidas++;
    atualizarProgresso();
}

function atualizarProgresso() {
    const porcentagem = Math.round(
        (concluidas / totalTarefas) * 100
    );
    document.getElementById("porcentagem").textContent = porcentagem + "%";
    document.getElementById("progresso-texto").textContent = `${concluidas} de ${totalTarefas} tarefas concluídas`;
    document.getElementById("barra-progresso").style.width = porcentagem + "%";
}

function adicionarTarefa() {
    const nome = prompt("Digite o nome da nova tarefa:");
    if (!nome || nome.trim() === "") {
        return;
    }
    const grid = document.querySelector(".tarefas-grid");
    const tarefa = document.createElement("article");
    tarefa.className = "tarefa";
    tarefa.innerHTML = `
                <div class="tarefa-icon">✨</div>
                <div class="tarefa-conteudo">
                    <span class="categoria">Personalizada</span>
                    <h3>${nome}</h3>
                    <p>Uma nova tarefa criada por você.</p>
                </div>
                <button class="btn-concluir" onclick="concluirTarefa(this)">Concluir</button>
            `;
    grid.appendChild(tarefa);
}