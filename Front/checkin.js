const form =
document.getElementById("formCheckin");

form.addEventListener(
    "submit",
    salvarCheckin
);

async function salvarCheckin(event){

    event.preventDefault();

    const emocaoSelecionada =
    document.querySelector(
        'input[name="emocao"]:checked'
    );

    if(!emocaoSelecionada){

        alert("Escolha uma emoção!");

        return;
    }

    const emocao =
    emocaoSelecionada.value;

    const texto =
    document.getElementById("texto").value;

    console.log(texto);

    const resposta =
    await fetch(
        "http://localhost:3000/checkin",
        {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                emocao: emocao,

                texto: texto,

                usuario_id: 1

            })

        }
    );

    const dados =
    await resposta.json();

    alert(dados.mensagem);

    form.reset();

}