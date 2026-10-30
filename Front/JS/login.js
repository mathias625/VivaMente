<<<<<<< HEAD
let modoCadastro = false;

const abaEntrar = document.getElementById("aba-entrar");
const abaCadastro = document.getElementById("aba-cadastro");
const grupoTipo = document.getElementById("grupo-tipo");
const campoNome = document.getElementById("campo-nome");
const erroBox = document.getElementById("login-erro");
const botao = document.getElementById("btn-login");

function definirModo(cadastro) {
    modoCadastro = cadastro;
    abaEntrar.classList.toggle("ativa", !cadastro);
    abaCadastro.classList.toggle("ativa", cadastro);
    grupoTipo.hidden = cadastro;
    campoNome.hidden = !cadastro;
    document.getElementById("login-titulo").textContent = cadastro ? "Criar conta" : "Entrar";
    document.getElementById("login-subtitulo").textContent = cadastro
        ? "Cadastre-se como psicólogo(a) para acompanhar seus pacientes."
        : "Acesse sua conta para acompanhar suas tarefas e conquistas.";
    document.getElementById("login-ajuda").hidden = cadastro;
    botao.textContent = cadastro ? "Criar conta e entrar" : "Entrar";
    erroBox.hidden = true;
}

abaEntrar.addEventListener("click", () => definirModo(false));
abaCadastro.addEventListener("click", () => definirModo(true));

function mostrarErro(msg) {
    erroBox.textContent = msg;
    erroBox.hidden = false;
}

async function entrar(email, senha, tipo) {
    const r = await api("/auth/login", {
        metodo: "POST",
        corpo: { email, senha, tipo },
        semAuth: true
    });
    Sessao.salvar(r.token, r.usuario);
    window.location.href = "tarefas.html";
}

document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    erroBox.hidden = true;

    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value;
    const nome = document.getElementById("login-nome").value.trim();
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (!email || !senha || (modoCadastro && !nome)) {
        return mostrarErro("Preencha todos os campos.");
    }

    botao.disabled = true;
    try {
        if (modoCadastro) {
            await api("/psicologo/cadastrar", {
                metodo: "POST",
                corpo: { nome, email, senha },
                semAuth: true
            });
            await entrar(email, senha, "psicologo");
        } else {
            await entrar(email, senha, tipo);
        }
    } catch (err) {
        mostrarErro(err.message);
        botao.disabled = false;
    }
});

if (new URLSearchParams(location.search).get("expirou")) {
    mostrarErro("Sua sessão expirou. Entre novamente.");
} else if (Sessao.token && Sessao.usuario) {
    window.location.href = "tarefas.html";
}
=======
/*
 * login.js — tela de login.
 * Depende de auth.js (carregado antes no HTML), que guarda o token no localStorage.
 */
(function () {
    "use strict";

    const CHAVE_EMAIL_LEMBRADO = "vivamente_email";
    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let tipoSelecionado = "paciente";

<<<<<<< HEAD
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
    toggleSenhaBtn.setAttribute(
        "aria-label",
        visivel ? "Mostrar senha" : "Ocultar senha"
    );
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
=======
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const lembrarInput = document.getElementById("lembrar");
    const btnEntrar = document.getElementById("btnEntrar");
    const mensagemErro = document.getElementById("mensagemErro");
    const toggleSenhaBtn = document.getElementById("toggleSenha");
    const tipoBotoes = document.querySelectorAll(".tipo-btn");
    const erroEmail = document.getElementById("erroEmail");
    const erroSenha = document.getElementById("erroSenha");

    // Já está logado? Vai direto para a área do usuário.
    if (VivaAuth.estaLogado()) {
        const atual = VivaAuth.obterUsuario();
        window.location.replace(VivaAuth.destinoPorTipo(atual && atual.tipo));
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
        return;
    }

    /* ---------- e-mail lembrado ---------- */
    function lerEmailLembrado() {
        try {
            return window.localStorage.getItem(CHAVE_EMAIL_LEMBRADO) || "";
        } catch (erro) {
            return "";
        }
    }

<<<<<<< HEAD
    try {
        const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha,
                tipo: tipoSelecionado
            })
        });
=======
    function guardarEmailLembrado(email) {
        try {
            if (email) {
                window.localStorage.setItem(CHAVE_EMAIL_LEMBRADO, email);
            } else {
                window.localStorage.removeItem(CHAVE_EMAIL_LEMBRADO);
            }
        } catch (erro) {
            /* sem armazenamento: apenas não lembra */
        }
    }
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523

    const emailLembrado = lerEmailLembrado();
    if (emailLembrado) {
        emailInput.value = emailLembrado;
        lembrarInput.checked = true;
    }

<<<<<<< HEAD
        if (!resposta.ok) {
            throw new Error(
                dados.mensagem ||
                "Não foi possível entrar. Verifique seus dados."
            );
        }

        if (!dados.token) {
            throw new Error("O servidor não retornou um token de acesso.");
        }

        const lembrar = document.getElementById("lembrar").checked;

        const armazenamento = lembrar
            ? window.localStorage
            : window.sessionStorage;

        armazenamento.setItem("vivamente_token", dados.token);
        armazenamento.setItem(
            "vivamente_usuario",
            JSON.stringify(dados.usuario)
        );

        window.location.href = "perfil.html";

    } catch (erro) {
        mostrarErro(
            erro.message ||
            "Erro ao conectar com o servidor. Tente novamente."
        );
    } finally {
        definirCarregando(false);
=======
    /* ---------- mensagens ---------- */
    function mostrarErroGeral(texto) {
        mensagemErro.textContent = texto;
        mensagemErro.classList.add("visivel");
    }

    function esconderErroGeral() {
        mensagemErro.textContent = "";
        mensagemErro.classList.remove("visivel");
    }

    function marcarCampo(input, elementoErro, texto) {
        elementoErro.textContent = texto;
        input.setAttribute("aria-invalid", "true");
    }

    function limparCampo(input, elementoErro) {
        elementoErro.textContent = "";
        input.removeAttribute("aria-invalid");
    }

    function limparTudo() {
        esconderErroGeral();
        limparCampo(emailInput, erroEmail);
        limparCampo(senhaInput, erroSenha);
    }

    function validar(email, senha) {
        let primeiroInvalido = null;

        if (!email) {
            marcarCampo(emailInput, erroEmail, "Informe seu e-mail.");
            primeiroInvalido = emailInput;
        } else if (!REGEX_EMAIL.test(email)) {
            marcarCampo(emailInput, erroEmail, "Digite um e-mail válido, como nome@email.com.");
            primeiroInvalido = emailInput;
        }

        if (!senha) {
            marcarCampo(senhaInput, erroSenha, "Informe sua senha.");
            if (!primeiroInvalido) primeiroInvalido = senhaInput;
        }

        if (primeiroInvalido) primeiroInvalido.focus();
        return primeiroInvalido === null;
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
    }

    function definirCarregando(carregando) {
        btnEntrar.disabled = carregando;
        btnEntrar.textContent = carregando ? "Entrando..." : "Entrar";
        btnEntrar.setAttribute("aria-busy", carregando ? "true" : "false");
    }

    /* ---------- interações ---------- */
    tipoBotoes.forEach(function (botao) {
        botao.addEventListener("click", function () {
            tipoBotoes.forEach(function (outro) {
                outro.classList.remove("ativo");
                outro.setAttribute("aria-pressed", "false");
            });
            botao.classList.add("ativo");
            botao.setAttribute("aria-pressed", "true");
            tipoSelecionado = botao.dataset.tipo;
            esconderErroGeral();
        });
    });

    toggleSenhaBtn.addEventListener("click", function () {
        const mostrando = senhaInput.type === "text";
        senhaInput.type = mostrando ? "password" : "text";
        toggleSenhaBtn.classList.toggle("ativo", !mostrando);
        toggleSenhaBtn.setAttribute("aria-pressed", mostrando ? "false" : "true");
        toggleSenhaBtn.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
        senhaInput.focus();
    });

    emailInput.addEventListener("input", function () {
        limparCampo(emailInput, erroEmail);
        esconderErroGeral();
    });
    senhaInput.addEventListener("input", function () {
        limparCampo(senhaInput, erroSenha);
        esconderErroGeral();
    });

    function mensagemParaStatus(status, mensagemServidor) {
        if (status === 401) {
            return "E-mail ou senha incorretos. Confira os dados e se escolheu o tipo certo de acesso (paciente ou psicólogo(a)).";
        }
        if (status >= 500) {
            return "O servidor encontrou um problema. Tente novamente em alguns instantes.";
        }
        return mensagemServidor || "Não foi possível entrar. Verifique os dados e tente novamente.";
    }

    form.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        if (btnEntrar.disabled) return;
        limparTudo();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        if (!validar(email, senha)) return;

        definirCarregando(true);
        let redirecionando = false;

        try {
            const resposta = await fetch(VivaAuth.API_URL + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, senha: senha, tipo: tipoSelecionado })
            });

            const dados = await resposta.json().catch(function () {
                return {};
            });

            if (!resposta.ok) {
                mostrarErroGeral(mensagemParaStatus(resposta.status, dados.mensagem));
                senhaInput.focus();
                senhaInput.select();
                return;
            }

            if (!dados.token || !dados.usuario) {
                mostrarErroGeral("Resposta inesperada do servidor. Tente novamente.");
                return;
            }

            // Sprint: salvar o token no localStorage.
            if (!VivaAuth.salvarSessao(dados.token, dados.usuario)) {
                mostrarErroGeral("Seu navegador bloqueou o armazenamento local. Libere o armazenamento do site para continuar.");
                return;
            }

            guardarEmailLembrado(lembrarInput.checked ? email : "");

            redirecionando = true;
            btnEntrar.textContent = "Entrando...";
            window.location.href = VivaAuth.destinoPorTipo(dados.usuario.tipo || tipoSelecionado);
        } catch (erro) {
            mostrarErroGeral("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
        } finally {
            if (!redirecionando) definirCarregando(false);
        }
    });
})();
>>>>>>> 6465356a40555210988254c58ff46100d4d76ca1
