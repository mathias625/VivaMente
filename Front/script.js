const url = 'http://localhost:3000/produtos';

let produtos = [];
let produtoAtual = null;

carregarProdutos();

function carregarProdutos() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            produtos = data;
            listar();
        });
}

function listar() {
    const main = document.querySelector('main');
    main.innerHTML = '';

    produtos.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <h3>${p.nome}</h3>
            <img src="${p.imagem}">
            <p>R$ ${p.preco}</p>
            <small>${p.marca}</small>
        `;

        card.onclick = () => abrir(p);

        main.appendChild(card);
    });
}

function abrir(p) {
    produtoAtual = p;

    titulo.innerText = p.nome;
    imgProduto.src = p.imagem;

    nomeEdit.value = p.nome;
    imgEdit.value = p.imagem;
    precoEdit.value = p.preco;
    categoriaEdit.value = p.categoria;
    marcaEdit.value = p.marca;

    detalhes.classList.remove('oculto');
}

document.querySelector("#formCad").addEventListener("submit", e => {
    e.preventDefault();

    const novo = {
        nome: nome.value,
        imagem: imagem.value,
        preco: Number(preco.value),
        categoria: categoria.value,
        marca: marca.value
    };

    fetch(url, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(novo)
    })
    .then(() => {
        cadastro.classList.add('oculto');
        carregarProdutos();
    });
});

function salvarEdicao() {
    const editado = {
        nome: nomeEdit.value,
        imagem: imgEdit.value,
        preco: Number(precoEdit.value),
        categoria: categoriaEdit.value,
        marca: marcaEdit.value
    };

    fetch(url + "/" + produtoAtual.id, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(editado)
    })
    .then(() => {
        detalhes.classList.add('oculto');
        carregarProdutos();
    });
}

function excluirProduto() {
    fetch(url + "/" + produtoAtual.id, {
        method: "DELETE"
    })
    .then(() => {
        detalhes.classList.add('oculto');
        carregarProdutos();
    });
}