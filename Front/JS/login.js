const API_BASE_URL = "http://localhost:3000";

let tipoSelecionado = "paciente";

const form = document.getElementById("loginForm");
const btnEntrar = document.getElementById("btnEntrar");
const mensagemErro = document.getElementById("mensagemErro");
const toggleSenhaBtn = document.getElementById("toggleSenha");
const senhaInput = document.getElementById("senha");
const tipoBotoes = document.querySelectorAll(".tipo-btn");

tipoBotoes.forEach((botao) => {
    botao.addEventListener("click", () => {
        tipoBotoes.forEach((b) => {
            b.classList.remove("ativo");
            b.setAttribute("aria-selected", "false");
        });
        botao.classList.add("ativo");
        botao.setAttribute("aria-selected", "true");
        tipoSelecionado = botao.dataset.tipo;
        esconderErro();
    });
});

toggleSenhaBtn.addEventListener("click", () => {
    const visivel = senhaInput.type === "text";
    senhaInput.type = visivel ? "password" : "text";
    toggleSenhaBtn.textContent = visivel ? "👁" : "🙈";
    toggleSenhaBtn.setAttribute("aria-label", visivel ? "Mostrar senha" : "Ocultar senha");
});

function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.classList.add("visivel");
}

function esconderErro() {
    mensagemErro.textContent = "";
    mensagemErro.classList.remove("visivel");
}

function definirCarregando(carregando) {
    btnEntrar.disabled = carregando;
    btnEntrar.textContent = carregando ? "Entrando..." : "Entrar";
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    esconderErro();

    const email = document.getElementById("email").value.trim();
    const senha = senhaInput.value;

    if (!email || !senha) {
        mostrarErro("Preencha e-mail e senha para continuar.");
        return;
    }

    definirCarregando(true);

    try {
        const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha, tipo: tipoSelecionado })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Não foi possível entrar. Verifique seus dados.");
        }

        const lembrar = document.getElementById("lembrar").checked;
        const armazenamento = lembrar ? window.localStorage : window.sessionStorage;
        armazenamento.setItem("vivamente_token", dados.token);
        armazenamento.setItem("vivamente_usuario", JSON.stringify(dados.usuario));

        window.location.href = "perfil.html";
    } catch (erro) {
        mostrarErro(erro.message || "Erro ao conectar com o servidor. Tente novamente.");
    } finally {
        definirCarregando(false);
    }
});
