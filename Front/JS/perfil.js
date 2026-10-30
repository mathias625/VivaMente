<<<<<<< HEAD
let dadosPerfil = { nome: "", email: "" };

function preencherLateral() {
    document.getElementById("avatar-iniciais").textContent = iniciais(dadosPerfil.nome);
    document.getElementById("perfil-nome-lateral").textContent = dadosPerfil.nome;
    document.getElementById("perfil-email-lateral").textContent = dadosPerfil.email;
}

function preencherFormulario() {
    document.getElementById("nome").value = dadosPerfil.nome;
    document.getElementById("email").value = dadosPerfil.email;
}

async function iniciarPerfil() {
    const usuario = Sessao.usuario;
    dadosPerfil = { nome: usuario.nome || "", email: usuario.email || "" };
    document.getElementById("tipoConta").value = usuario.tipo === "psicologo" ? "Psicólogo(a)" : "Paciente";
    preencherLateral();
    preencherFormulario();

    try {
        if (usuario.tipo === "paciente") {
            const [lista, psicologo] = await Promise.all([
                api("/paciente/listar"),
                api("/paciente/meu-psicologo")
            ]);
            const eu = lista[0];
            if (eu) {
                dadosPerfil = { nome: eu.nome, email: eu.email };
                document.getElementById("pontos").value = eu.pontos;
                document.querySelectorAll(".pontos-valor").forEach(el => { el.textContent = eu.pontos; });
            }
            document.getElementById("psicologo").value = psicologo.nome + " (" + psicologo.email + ")";
        } else {
            await carregarPacientes();
        }
        Sessao.atualizarUsuario(dadosPerfil);
        preencherLateral();
        preencherFormulario();
    } catch (e) {
        toast(e.message, "erro");
    }
}

/* ---------- Salvar dados ---------- */
document.getElementById("perfilForm").addEventListener("submit", async e => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!nome || !email) return toast("Nome e e-mail são obrigatórios.", "erro");

    const usuario = Sessao.usuario;
    const rota = usuario.tipo === "psicologo" ? "/psicologo/atualizar/" : "/paciente/atualizar/";
    try {
        const r = await api(rota + usuario.id, { metodo: "PUT", corpo: { nome, email } });
        dadosPerfil = { nome: r.nome, email: r.email };
        Sessao.atualizarUsuario(dadosPerfil);
        preencherLateral();
        preencherFormulario();
        toast("Perfil atualizado com sucesso!");
    } catch (err) {
        toast(err.message, "erro");
    }
});

document.getElementById("cancelar").addEventListener("click", preencherFormulario);
document.getElementById("btn-sair").addEventListener("click", sair);

/* ---------- Alterar senha ---------- */
document.getElementById("btn-senha").addEventListener("click", async () => {
    const v = await formularioModal("Alterar senha", [
        { id: "nova", label: "Nova senha", tipo: "password", obrigatorio: true },
        { id: "confirma", label: "Confirmar nova senha", tipo: "password", obrigatorio: true }
    ], "Alterar senha");
    if (!v) return;
    if (v.nova.length < 6) return toast("A senha deve ter pelo menos 6 caracteres.", "erro");
    if (v.nova !== v.confirma) return toast("As senhas não coincidem.", "erro");

    const usuario = Sessao.usuario;
    const rota = usuario.tipo === "psicologo" ? "/psicologo/atualizar/" : "/paciente/atualizar/";
    try {
        await api(rota + usuario.id, { metodo: "PUT", corpo: { senha: v.nova } });
        toast("Senha alterada com sucesso!");
    } catch (err) {
        toast(err.message, "erro");
    }
});

/* ---------- Pacientes (somente psicólogo) ---------- */
async function carregarPacientes() {
    const bloco = document.querySelector(".pacientes-bloco");
    bloco.hidden = false;
    const pacientes = await api("/psicologo/meus-pacientes");
    document.getElementById("totalPacientes").value = pacientes.length;

    const lista = document.getElementById("lista-pacientes");
    lista.innerHTML = pacientes.length
        ? pacientes.map(p => `
            <div class="paciente-item">
                <div class="mini-avatar">${esc(iniciais(p.nome))}</div>
                <div><strong>${esc(p.nome)}</strong><span>${esc(p.email)}</span></div>
                <span class="pontos-tag">⭐ ${esc(p.pontos)} pontos</span>
            </div>`).join("")
        : `<div class="vazio">Você ainda não tem pacientes cadastrados.</div>`;
}

document.getElementById("btn-novo-paciente").addEventListener("click", async () => {
    const v = await formularioModal("Novo paciente", [
        { id: "nome", label: "Nome completo", obrigatorio: true },
        { id: "email", label: "E-mail", tipo: "email", obrigatorio: true },
        { id: "senha", label: "Senha inicial", tipo: "password", obrigatorio: true }
    ], "Cadastrar");
    if (!v) return;
    if (v.senha.length < 6) return toast("A senha deve ter pelo menos 6 caracteres.", "erro");

    try {
        await api("/paciente/cadastrar", {
            metodo: "POST",
            corpo: { ...v, psicologoId: Sessao.usuario.id }
        });
        toast("Paciente cadastrado!");
        await carregarPacientes();
    } catch (err) {
        toast(err.message, "erro");
    }
});

/* ---------- Início (depois de declarar tudo) ---------- */
if (exigirLogin()) iniciarPerfil();
=======
/*
 * perfil.js — mostra na página os dados de quem está logado (vindos do login, salvos pelo auth.js).
 * A proteção da página (exigir login) é feita no <head> com VivaAuth.exigirLogin().
 */
(function () {
    "use strict";

    const usuario = VivaAuth.obterUsuario();
    if (!usuario) return;

    const nome = usuario.nome || "";
    const email = usuario.email || "";

    function iniciais(texto) {
        const partes = texto.trim().split(/\s+/).filter(Boolean);
        if (!partes.length) return "U";
        const primeira = partes[0].charAt(0);
        const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : "";
        return (primeira + ultima).toUpperCase();
    }

    const avatar = document.querySelector(".avatar span");
    const titulo = document.querySelector(".perfil-lateral h2");
    const subtitulo = document.querySelector(".perfil-lateral p");
    const campoNome = document.getElementById("nome");
    const campoEmail = document.getElementById("email");

    if (avatar) avatar.textContent = iniciais(nome);
    if (titulo && nome) titulo.textContent = nome;
    if (subtitulo && email) subtitulo.textContent = email;
    if (campoNome && nome) campoNome.value = nome;
    if (campoEmail && email) campoEmail.value = email;
})();
>>>>>>> 6465356a40555210988254c58ff46100d4d76ca1
