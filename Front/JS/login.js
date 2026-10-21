/*
 * login.js — tela de login.
 * Depende de auth.js (carregado antes no HTML), que guarda o token no localStorage.
 */
(function () {
    "use strict";

    const CHAVE_EMAIL_LEMBRADO = "vivamente_email";
    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let tipoSelecionado = "paciente";

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

    const emailLembrado = lerEmailLembrado();
    if (emailLembrado) {
        emailInput.value = emailLembrado;
        lembrarInput.checked = true;
    }

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
