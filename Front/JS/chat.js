const API = "http://localhost:3000";

const token = localStorage.getItem("token");
const usuarioSalvo = localStorage.getItem("usuario");

let usuario = null;
let conversaAtual = null;
let conversas = [];

const listaConversas = document.getElementById("listaConversas");
const mensagens = document.getElementById("mensagens");
const formMensagem = document.getElementById("formMensagem");
const textoMensagem = document.getElementById("textoMensagem");
const enviarMensagem = document.getElementById("enviarMensagem");
const digitando = document.getElementById("digitando");
const novaConversa = document.getElementById("novaConversa");
const atualizarConversas = document.getElementById("atualizarConversas");
const nomeUsuario = document.getElementById("nomeUsuario");
const avatarUsuario = document.getElementById("avatarUsuario");
const sair = document.getElementById("sair");
const toast = document.getElementById("toast");

try {
    usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
} catch (error) {
    usuario = null;
}

function mostrarToast(mensagem) {
    toast.textContent = mensagem;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function verificarAuth() {
    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    if (!usuario || usuario.tipo !== "paciente") {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
        return false;
    }

    nomeUsuario.textContent = usuario.nome || "Usuário";
    avatarUsuario.textContent = (usuario.nome || "U").charAt(0).toUpperCase();

    return true;
}

async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(`${API}${url}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(opcoes.headers || {})
        }
    });

    const dados = await resposta.json().catch(() => ({}));

    if (resposta.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
        throw new Error("Sessão expirada.");
    }

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || "Não foi possível realizar a operação."
        );
    }

    return dados;
}

function formatarData(data) {
    if (!data) {
        return "";
    }

    return new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
    });
}

function formatarHora(data) {
    if (!data) {
        return "";
    }

    return new Date(data).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderizarConversas() {
    listaConversas.innerHTML = "";

    if (!conversas.length) {
        listaConversas.innerHTML = `
            <div class="empty-conversas">
                Você ainda não possui conversas.<br>
                Comece uma nova conversa.
            </div>
        `;
        return;
    }

    conversas.forEach((conversa) => {
        const botao = document.createElement("div");

        botao.className = `conversa ${
            conversa.id === conversaAtual ? "active" : ""
        }`;

        botao.innerHTML = `
            <div class="conversa-icon">✦</div>
            <div class="conversa-texto">
                <strong>Conversa #${conversa.id}</strong>
                <span>${formatarData(conversa.criadaEm)}</span>
            </div>
            <button class="conversa-excluir" title="Excluir">×</button>
        `;

        botao.addEventListener("click", (evento) => {
            if (evento.target.closest(".conversa-excluir")) {
                return;
            }

            carregarConversa(conversa.id);
        });

        botao
            .querySelector(".conversa-excluir")
            .addEventListener("click", () => {
                excluirConversa(conversa.id);
            });

        listaConversas.appendChild(botao);
    });
}

async function carregarConversas() {
    try {
        conversas = await requisicao("/chat/listar");

        renderizarConversas();

        if (!conversaAtual && conversas.length) {
            await carregarConversa(conversas[0].id);
        }
    } catch (error) {
        mostrarToast(error.message);
    }
}

function limparMensagens() {
    mensagens.innerHTML = "";
}

function criarMensagem(tipo, texto, data) {
    const mensagem = document.createElement("div");

    mensagem.className = `message ${tipo === "usuario" ? "user" : ""}`;

    mensagem.innerHTML = `
        <div class="message-avatar">
            ${tipo === "usuario" ? "U" : "✦"}
        </div>

        <div class="message-content">
            <div class="message-bubble"></div>
            <div class="message-time">${formatarHora(data)}</div>
        </div>
    `;

    mensagem.querySelector(".message-bubble").textContent = texto;

    mensagens.appendChild(mensagem);
}

function mostrarTelaInicial() {
    limparMensagens();

    mensagens.innerHTML = `
        <div class="welcome" id="telaInicial">
            <div class="welcome-icon">✦</div>

            <span class="eyebrow">CUIDADO QUE TRANSFORMA</span>

            <h2>Como você está se sentindo hoje?</h2>

            <div class="suggestions">
                <button class="suggestion">Quero falar sobre como estou me sentindo</button>

                <button class="suggestion">Estou tendo um dia difícil</button>

                <button class="suggestion">Quero organizar meus pensamentos</button>
            </div>
        </div>
    `;

    document.querySelectorAll(".suggestion").forEach((botao) => {
        botao.addEventListener("click", () => {
            textoMensagem.value = botao.textContent;
            ajustarTextarea();
            textoMensagem.focus();
        });
    });
}

async function carregarConversa(id) {
    try {
        const conversa = await requisicao(`/chat/${id}`);

        conversaAtual = conversa.id;

        limparMensagens();

        if (!conversa.mensagens || !conversa.mensagens.length) {
            mostrarTelaInicial();
        } else {
            conversa.mensagens.forEach((mensagem) => {
                criarMensagem(
                    mensagem.tipo,
                    mensagem.texto,
                    mensagem.criadaEm
                );
            });
        }

        renderizarConversas();
        rolarParaBaixo();
    } catch (error) {
        mostrarToast(error.message);
    }
}

async function criarNovaConversa() {
    try {
        const conversa = await requisicao("/chat/criar", {
            method: "POST"
        });

        conversaAtual = conversa.id;

        await carregarConversas();
        await carregarConversa(conversa.id);

        textoMensagem.focus();
    } catch (error) {
        mostrarToast(error.message);
    }
}

async function enviarTexto(texto) {
    if (!conversaAtual) {
        await criarNovaConversa();
    }

    if (!conversaAtual) {
        return;
    }

    criarMensagem(
        "usuario",
        texto,
        new Date().toISOString()
    );

    rolarParaBaixo();

    digitando.classList.add("visible");
    enviarMensagem.disabled = true;

    try {
        const resultado = await requisicao(
            `/chat/${conversaAtual}/mensagem`,
            {
                method: "POST",
                body: JSON.stringify({
                    texto
                })
            }
        );

        criarMensagem(
            "ia",
            resultado.resposta,
            new Date().toISOString()
        );

        rolarParaBaixo();

        await carregarConversas();
    } catch (error) {
        mostrarToast(error.message);
    } finally {
        digitando.classList.remove("visible");
        enviarMensagem.disabled = false;
    }
}

async function excluirConversa(id) {
    const confirmar = window.confirm(
        "Deseja excluir esta conversa?"
    );

    if (!confirmar) {
        return;
    }

    try {
        await requisicao(`/chat/${id}`, {
            method: "DELETE"
        });

        if (conversaAtual === id) {
            conversaAtual = null;
            mostrarTelaInicial();
        }

        await carregarConversas();

        mostrarToast("Conversa excluída.");
    } catch (error) {
        mostrarToast(error.message);
    }
}

function ajustarTextarea() {
    textoMensagem.style.height = "auto";
    textoMensagem.style.height = `${Math.min(
        textoMensagem.scrollHeight,
        130
    )}px`;
}

function rolarParaBaixo() {
    requestAnimationFrame(() => {
        mensagens.scrollTop = mensagens.scrollHeight;
    });
}

formMensagem.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const texto = textoMensagem.value;

    if (!texto || enviarMensagem.disabled) {
        return;
    }

    textoMensagem.value = "";

    ajustarTextarea();

    await enviarTexto(texto);
});

textoMensagem.addEventListener("input", ajustarTextarea);

textoMensagem.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
        evento.preventDefault();
        formMensagem.requestSubmit();
    }
});

novaConversa.addEventListener("click", criarNovaConversa);

atualizarConversas.addEventListener("click", carregarConversas);

sair.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "login.html";
});

async function iniciar() {
    if (!verificarAuth()) {
        return;
    }

    await carregarConversas();
}

iniciar();