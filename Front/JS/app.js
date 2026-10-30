/* ===== VivaMente | Integração com o Back-end (compartilhado por todas as páginas) ===== */

// Desenvolvimento no mesmo computador: http://localhost:3000
// Teste em outro dispositivo na mesma rede: use o IP local do computador,
// por exemplo http://192.168.0.10:3000. Em produção, informe a URL pública.
const API_URL = window.VM_API_URL || "http://localhost:3000";

/* ---------- Sessão (token + dados do usuário) ---------- */
const Sessao = {
    get token() {
        try { return localStorage.getItem("vm_token"); } catch { return null; }
    },
    get usuario() {
        try { return JSON.parse(localStorage.getItem("vm_usuario")); } catch { return null; }
    },
    salvar(token, usuario) {
        localStorage.setItem("vm_token", token);
        localStorage.setItem("vm_usuario", JSON.stringify(usuario));
    },
    atualizarUsuario(dados) {
        localStorage.setItem("vm_usuario", JSON.stringify({ ...this.usuario, ...dados }));
    },
    limpar() {
        localStorage.removeItem("vm_token");
        localStorage.removeItem("vm_usuario");
    }
};

/* ---------- Requisições ---------- */
async function api(caminho, { metodo = "GET", corpo, semAuth = false } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (!semAuth && Sessao.token) headers.Authorization = "Bearer " + Sessao.token;

    let resposta;
    try {
        resposta = await fetch(API_URL + caminho, {
            method: metodo,
            headers,
            body: corpo !== undefined ? JSON.stringify(corpo) : undefined
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor. Verifique se o Back-end está rodando.");
    }

    let dados = null;
    try { dados = await resposta.json(); } catch { /* resposta sem corpo */ }

    if (!resposta.ok) {
        if (resposta.status === 401 && !semAuth) {
            Sessao.limpar();
            window.location.href = "login.html?expirou=1";
            throw new Error("Sessão expirada. Faça login novamente.");
        }
        throw new Error((dados && dados.mensagem) || "Erro ao processar a requisição.");
    }
    return dados;
}

/* ---------- Utilidades ---------- */
function esc(texto) {
    const d = document.createElement("div");
    d.textContent = texto == null ? "" : String(texto);
    return d.innerHTML;
}

function iniciais(nome) {
    return String(nome || "?").trim().split(/\s+/).slice(0, 2)
        .map(p => p[0].toUpperCase()).join("");
}

function formatarData(iso) {
    return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function paraInputDataHora(iso) {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

/* ---------- Aviso (toast) ---------- */
function toast(mensagem, tipo = "sucesso") {
    let caixa = document.getElementById("toast-caixa");
    if (!caixa) {
        caixa = document.createElement("div");
        caixa.id = "toast-caixa";
        document.body.appendChild(caixa);
    }
    const item = document.createElement("div");
    item.className = "toast toast-" + tipo;
    item.textContent = mensagem;
    caixa.appendChild(item);
    setTimeout(() => item.classList.add("toast-sai"), 3500);
    setTimeout(() => item.remove(), 4000);
}

/* ---------- Modal com formulário ----------
   campos: [{ id, label, tipo: text|number|password|datetime-local|select|textarea,
              opcoes: [{valor, texto}], valor, obrigatorio, min }]
   Retorna uma Promise com { id: valor } ou null se cancelado. */
function formularioModal(titulo, campos, textoBotao = "Salvar") {
    return new Promise(resolve => {
        const fundo = document.createElement("div");
        fundo.className = "modal-fundo";

        const camposHtml = campos.map(c => {
            let entrada;
            if (c.tipo === "select") {
                entrada = `<select id="modal-${c.id}" ${c.obrigatorio ? "required" : ""}>` +
                    c.opcoes.map(o => `<option value="${esc(o.valor)}" ${String(o.valor) === String(c.valor) ? "selected" : ""}>${esc(o.texto)}</option>`).join("") +
                    `</select>`;
            } else if (c.tipo === "textarea") {
                entrada = `<textarea id="modal-${c.id}" rows="3" ${c.obrigatorio ? "required" : ""}>${esc(c.valor || "")}</textarea>`;
            } else {
                entrada = `<input id="modal-${c.id}" type="${c.tipo || "text"}" value="${esc(c.valor ?? "")}"
                    ${c.min !== undefined ? `min="${c.min}"` : ""} ${c.obrigatorio ? "required" : ""}>`;
            }
            return `<div class="modal-campo"><label for="modal-${c.id}">${esc(c.label)}</label>${entrada}</div>`;
        }).join("");

        fundo.innerHTML = `
            <form class="modal" novalidate>
                <h3>${esc(titulo)}</h3>
                ${camposHtml}
                <div class="modal-acoes">
                    <button type="button" class="modal-cancelar">Cancelar</button>
                    <button type="submit" class="modal-confirmar">${esc(textoBotao)}</button>
                </div>
            </form>`;
        document.body.appendChild(fundo);

        const form = fundo.querySelector("form");
        const fechar = valor => { fundo.remove(); resolve(valor); };
        const primeiro = fundo.querySelector("input, select, textarea");
        if (primeiro) primeiro.focus();

        fundo.querySelector(".modal-cancelar").onclick = () => fechar(null);
        fundo.addEventListener("mousedown", e => { if (e.target === fundo) fechar(null); });
        form.addEventListener("keydown", e => { if (e.key === "Escape") fechar(null); });
        form.addEventListener("submit", e => {
            e.preventDefault();
            const valores = {};
            for (const c of campos) {
                const el = fundo.querySelector("#modal-" + c.id);
                const v = el.value.trim();
                if (c.obrigatorio && !v) {
                    toast(`Preencha o campo "${c.label}".`, "erro");
                    el.focus();
                    return;
                }
                valores[c.id] = v;
            }
            fechar(valores);
        });
    });
}

/* ---------- Autenticação nas páginas ---------- */
function exigirLogin(tipos) {
    if (!Sessao.token || !Sessao.usuario) {
        window.location.href = "login.html";
        return false;
    }
    if (tipos && !tipos.includes(Sessao.usuario.tipo)) {
        window.location.href = "tarefas.html";
        return false;
    }
    return true;
}

function sair() {
    Sessao.limpar();
    window.location.href = "login.html";
}

function montarMenu() {
    const link = document.getElementById("nav-auth");
    if (link) {
        if (Sessao.token) {
            link.textContent = "Sair";
            link.href = "#";
            link.addEventListener("click", e => { e.preventDefault(); sair(); });
        } else {
            link.textContent = "Entrar";
            link.href = "login.html";
        }
    }
    const tipo = Sessao.usuario && Sessao.usuario.tipo;
    document.querySelectorAll("[data-somente]").forEach(el => {
        el.hidden = tipo !== el.dataset.somente;
    });
}

/* Atualiza o saldo de pontos (somente paciente) em elementos com a classe .pontos-valor */
async function atualizarPontos() {
    const alvos = document.querySelectorAll(".pontos-valor");
    if (!alvos.length || !Sessao.usuario || Sessao.usuario.tipo !== "paciente") return null;
    try {
        const lista = await api("/paciente/listar");
        const pontos = lista[0] ? lista[0].pontos : 0;
        alvos.forEach(el => { el.textContent = pontos; });
        return pontos;
    } catch (e) {
        toast(e.message, "erro");
        return null;
    }
}

document.addEventListener("DOMContentLoaded", montarMenu);
