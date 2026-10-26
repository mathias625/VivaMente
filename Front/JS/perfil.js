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