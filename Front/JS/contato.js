/*
 * contato.js — formulário de contato da home (index.html).
 * Envia para POST /contato. Depende de auth.js (só para pegar a URL da API
 * e preencher nome/e-mail de quem já está logado).
 */
(function () {
    "use strict";

    const form = document.getElementById("contatoForm");
    if (!form) return;

    const LIMITE_MENSAGEM = 2000;
    const MIN_MENSAGEM = 10;
    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const ASSUNTOS = ["duvida", "acesso", "sugestao", "elogio", "outro"];

    const campos = {
        nome: {
            input: document.getElementById("contatoNome"),
            erro: document.getElementById("erroContatoNome")
        },
        email: {
            input: document.getElementById("contatoEmail"),
            erro: document.getElementById("erroContatoEmail")
        },
        assunto: {
            input: document.getElementById("contatoAssunto"),
            erro: document.getElementById("erroContatoAssunto")
        },
        mensagem: {
            input: document.getElementById("contatoMensagem"),
            erro: document.getElementById("erroContatoMensagem")
        }
    };
    const isca = document.getElementById("contatoSite");
    const contador = document.getElementById("contadorMensagem");
    const erroGeral = document.getElementById("contatoErro");
    const botaoEnviar = document.getElementById("contatoEnviar");
    const blocoSucesso = document.getElementById("contatoSucesso");
    const tituloSucesso = document.getElementById("contatoSucessoTitulo");
    const textoSucesso = document.getElementById("contatoSucessoTexto");
    const botaoNova = document.getElementById("contatoNova");

    /* ---------- pré-preenchimento ---------- */
    function preencherInicial() {
        const usuario =
            typeof VivaAuth !== "undefined" && VivaAuth.estaLogado() ? VivaAuth.obterUsuario() : null;
        if (usuario) {
            if (usuario.nome && !campos.nome.input.value) campos.nome.input.value = usuario.nome;
            if (usuario.email && !campos.email.input.value) campos.email.input.value = usuario.email;
        }

        // Links como index.html?assunto=acesso#contato já escolhem o assunto.
        const assunto = new URLSearchParams(window.location.search).get("assunto");
        if (assunto && ASSUNTOS.indexOf(assunto) !== -1) {
            campos.assunto.input.value = assunto;
        }
    }

    /* ---------- erros ---------- */
    function marcar(nome, texto) {
        campos[nome].erro.textContent = texto;
        campos[nome].input.setAttribute("aria-invalid", "true");
    }

    function limpar(nome) {
        campos[nome].erro.textContent = "";
        campos[nome].input.removeAttribute("aria-invalid");
    }

    function limparTudo() {
        Object.keys(campos).forEach(limpar);
        mostrarErroGeral("");
    }

    function mostrarErroGeral(texto) {
        erroGeral.textContent = texto;
        erroGeral.classList.toggle("visivel", Boolean(texto));
    }

    function atualizarContador() {
        const tamanho = campos.mensagem.input.value.length;
        contador.textContent = tamanho + "/" + LIMITE_MENSAGEM;
        contador.classList.toggle("limite", tamanho >= LIMITE_MENSAGEM - 100);
    }

    /* ---------- validação (espelha as regras do backend) ---------- */
    function validar(dados) {
        const invalidos = [];

        if (dados.nome.length < 2) {
            marcar("nome", dados.nome ? "O nome precisa ter pelo menos 2 letras." : "Informe seu nome.");
            invalidos.push("nome");
        }

        if (!dados.email) {
            marcar("email", "Informe seu e-mail.");
            invalidos.push("email");
        } else if (!REGEX_EMAIL.test(dados.email)) {
            marcar("email", "Digite um e-mail válido, como nome@email.com.");
            invalidos.push("email");
        }

        if (ASSUNTOS.indexOf(dados.assunto) === -1) {
            marcar("assunto", "Escolha um assunto.");
            invalidos.push("assunto");
        }

        if (dados.mensagem.length < MIN_MENSAGEM) {
            marcar(
                "mensagem",
                dados.mensagem
                    ? "Conte um pouco mais: a mensagem precisa ter pelo menos " + MIN_MENSAGEM + " caracteres."
                    : "Escreva sua mensagem."
            );
            invalidos.push("mensagem");
        }

        if (invalidos.length) campos[invalidos[0]].input.focus();
        return invalidos.length === 0;
    }

    function definirEnviando(enviando) {
        botaoEnviar.disabled = enviando;
        botaoEnviar.textContent = enviando ? "Enviando..." : "Enviar mensagem";
        botaoEnviar.setAttribute("aria-busy", enviando ? "true" : "false");
    }

    function mostrarSucesso(nome) {
        const primeiroNome = nome.split(" ")[0];
        textoSucesso.textContent =
            "Obrigado, " + primeiroNome + ". Recebemos sua mensagem e a nossa equipe vai analisá-la.";
        form.hidden = true;
        blocoSucesso.hidden = false;
        tituloSucesso.focus();
    }

    function voltarAoFormulario() {
        campos.mensagem.input.value = "";
        atualizarContador();
        limparTudo();
        blocoSucesso.hidden = true;
        form.hidden = false;
        campos.mensagem.input.focus();
    }

    function mensagemParaStatus(status, mensagemServidor) {
        if (status === 429) {
            return "Muitas mensagens em pouco tempo. Aguarde alguns minutos e tente novamente.";
        }
        if (status >= 500) {
            return "O servidor encontrou um problema. Tente novamente em alguns instantes.";
        }
        return mensagemServidor || "Não foi possível enviar a mensagem. Confira os dados e tente novamente.";
    }

    /* ---------- eventos ---------- */
    Object.keys(campos).forEach(function (nome) {
        const evento = nome === "assunto" ? "change" : "input";
        campos[nome].input.addEventListener(evento, function () {
            limpar(nome);
            mostrarErroGeral("");
        });
    });
    campos.mensagem.input.addEventListener("input", atualizarContador);
    botaoNova.addEventListener("click", voltarAoFormulario);

    form.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        if (botaoEnviar.disabled) return;
        limparTudo();

        const dados = {
            nome: campos.nome.input.value.trim(),
            email: campos.email.input.value.trim(),
            assunto: campos.assunto.input.value,
            mensagem: campos.mensagem.input.value.trim(),
            website: isca.value
        };

        if (!validar(dados)) return;

        definirEnviando(true);

        try {
            const url = (typeof VivaAuth !== "undefined" ? VivaAuth.API_URL : "http://localhost:3000") + "/contato";
            const resposta = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
            const corpo = await resposta.json().catch(function () {
                return {};
            });

            if (!resposta.ok) {
                // O servidor devolve { mensagem, erros: { campo: "texto" } } quando a validação falha.
                const erros = corpo.erros || {};
                let primeiro = null;
                Object.keys(erros).forEach(function (nome) {
                    if (campos[nome]) {
                        marcar(nome, erros[nome]);
                        if (!primeiro) primeiro = nome;
                    }
                });
                if (primeiro) {
                    campos[primeiro].input.focus();
                } else {
                    mostrarErroGeral(mensagemParaStatus(resposta.status, corpo.mensagem));
                }
                return;
            }

            mostrarSucesso(dados.nome);
        } catch (erro) {
            mostrarErroGeral("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
        } finally {
            definirEnviando(false);
        }
    });

    preencherInicial();
    atualizarContador();
})();
