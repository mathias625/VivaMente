const url = "http://localhost:3000/dicas";

const dicas = [];

carregarDicas();

function carregarDicas(){

    fetch(url)

    .then(resposta => resposta.json())

    .then(dados => {

        dicas.length = 0;

        dicas.push(...dados);

        listarCards();

    });

}

function listarCards(){

    const container =
    document.getElementById("cards");

    container.innerHTML = "";

    dicas.forEach(dica => {

        const card =
        document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
        
        <h2>${dica.titulo}</h2>

        <p><b>Categoria:</b> ${dica.categoria}</p>

        <p>${dica.descricao}</p>

        `;

        container.appendChild(card);

    });

}

document
.getElementById("formDica")

.addEventListener(
    "submit",
    salvarDica
);

async function salvarDica(event){

    event.preventDefault();

    const titulo =
    document.getElementById("titulo").value;

    const categoria =
    document.getElementById("categoria").value;

    const descricao =
    document.getElementById("descricao").value;

    await fetch(url, {

        method: "POST",

        headers: {
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            titulo: titulo,

            categoria: categoria,

            descricao: descricao

        })

    });

    alert("Dica adicionada!");

    cadastro.classList.add("oculto");

    carregarDicas();

}