const form =
document.getElementById("formAjuda");

form.addEventListener(
    "submit",
    enviarAjuda
);

async function enviarAjuda(event){

    event.preventDefault();

    const tipo =
    document.getElementById("tipo").value;

    const mensagem =
    document.getElementById("mensagem").value;

    const resposta = await fetch(
        "http://localhost:3000/ajuda",
        {

            method: "POST",

            headers: {
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                tipo: tipo,

                mensagem: mensagem,

                usuario_id: 1

            })

        }
    );

    const dados =
    await resposta.json();

    alert(dados.mensagem);

}