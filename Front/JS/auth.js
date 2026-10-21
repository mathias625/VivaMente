/*
 * auth.js — sessão do usuário (token JWT salvo no localStorage).
 *
 * Guarda exatamente as mesmas chaves que o chat.js já usa:
 *   localStorage["token"]   -> JWT devolvido por POST /auth/login
 *   localStorage["usuario"] -> { id, nome, email, tipo } em JSON
 *
 * Uso em qualquer página:
 *   <script src="../JS/auth.js"></script>
 *   VivaAuth.estaLogado();
 *   VivaAuth.exigirLogin();               // manda para o login se não houver sessão
 *   VivaAuth.requisicao("/paciente/listar"); // fetch já com "Authorization: Bearer ..."
 *   VivaAuth.sair();
 */
(function (global) {
    "use strict";

    const API_URL = "http://localhost:3000";
    const CHAVE_TOKEN = "token";
    const CHAVE_USUARIO = "usuario";

    // Para onde cada tipo de usuário vai depois de entrar.
    const DESTINO_POR_TIPO = {
        paciente: "chat.html",
        psicologo: "perfil.html"
    };
    const DESTINO_PADRAO = "perfil.html";

    // localStorage pode lançar erro (navegação privada, cookies bloqueados...).
    function armazenamento() {
        try {
            return global.localStorage;
        } catch (erro) {
            return null;
        }
    }

    // Lê o corpo (payload) do JWT sem validar a assinatura — quem valida é o servidor.
    function decodificarToken(token) {
        try {
            const corpo = String(token).split(".")[1];
            if (!corpo) return null;
            const base64 = corpo.replace(/-/g, "+").replace(/_/g, "/");
            const preenchido = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
            return JSON.parse(global.atob(preenchido));
        } catch (erro) {
            return null;
        }
    }

    function tokenExpirado(token) {
        const dados = decodificarToken(token);
        if (!dados || typeof dados.exp !== "number") return true;
        return dados.exp * 1000 <= Date.now();
    }

    function salvarSessao(token, usuario) {
        const loja = armazenamento();
        if (!loja || !token) return false;
        try {
            loja.setItem(CHAVE_TOKEN, token);
            loja.setItem(CHAVE_USUARIO, JSON.stringify(usuario || {}));
            return true;
        } catch (erro) {
            return false;
        }
    }

    function limparSessao() {
        const loja = armazenamento();
        if (!loja) return;
        try {
            loja.removeItem(CHAVE_TOKEN);
            loja.removeItem(CHAVE_USUARIO);
        } catch (erro) {
            /* nada a fazer */
        }
    }

    // Devolve o token válido ou null. Token vencido é apagado na hora.
    function obterToken() {
        const loja = armazenamento();
        if (!loja) return null;
        let token = null;
        try {
            token = loja.getItem(CHAVE_TOKEN);
        } catch (erro) {
            return null;
        }
        if (!token) return null;
        if (tokenExpirado(token)) {
            limparSessao();
            return null;
        }
        return token;
    }

    function obterUsuario() {
        const loja = armazenamento();
        if (!loja || !obterToken()) return null;
        try {
            const bruto = loja.getItem(CHAVE_USUARIO);
            return bruto ? JSON.parse(bruto) : null;
        } catch (erro) {
            return null;
        }
    }

    function estaLogado() {
        return obterToken() !== null && obterUsuario() !== null;
    }

    function destinoPorTipo(tipo) {
        return DESTINO_POR_TIPO[tipo] || DESTINO_PADRAO;
    }

    function sair(destino) {
        limparSessao();
        global.location.href = destino || "login.html";
    }

    function exigirLogin() {
        if (estaLogado()) return true;
        limparSessao();
        global.location.href = "login.html";
        return false;
    }

    // fetch que já envia o token. Se o servidor responder 401, a sessão acabou.
    async function requisicao(caminho, opcoes) {
        const config = opcoes || {};
        const token = obterToken();
        const resposta = await global.fetch(API_URL + caminho, {
            ...config,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: "Bearer " + token } : {}),
                ...(config.headers || {})
            }
        });
        if (resposta.status === 401) {
            sair("login.html");
            throw new Error("Sua sessão expirou. Entre novamente.");
        }
        return resposta;
    }

    // Troca o item #navAuth do menu: "Entrar" (visitante) ou "Sair" (logado).
    function montarMenu() {
        const item = global.document.getElementById("navAuth");
        if (!item) return;
        item.textContent = "";

        if (estaLogado()) {
            const botao = global.document.createElement("button");
            botao.type = "button";
            botao.className = "nav-sair";
            botao.textContent = "Sair";
            botao.addEventListener("click", function () {
                sair("login.html");
            });
            item.appendChild(botao);
        } else {
            const link = global.document.createElement("a");
            link.href = "login.html";
            link.className = "nav-entrar";
            link.textContent = "Entrar";
            item.appendChild(link);
        }
    }

    global.VivaAuth = {
        API_URL: API_URL,
        decodificarToken: decodificarToken,
        salvarSessao: salvarSessao,
        limparSessao: limparSessao,
        obterToken: obterToken,
        obterUsuario: obterUsuario,
        estaLogado: estaLogado,
        destinoPorTipo: destinoPorTipo,
        exigirLogin: exigirLogin,
        requisicao: requisicao,
        sair: sair,
        montarMenu: montarMenu
    };

    if (global.document.readyState === "loading") {
        global.document.addEventListener("DOMContentLoaded", montarMenu);
    } else {
        montarMenu();
    }
})(window);