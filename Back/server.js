require("dotenv").config();
const express=require("express");
const cors=require("cors");
const app=express();
app.use(cors());

app.use(express.json());

app.use("/auth",require("./src/routes/login.routes"));
app.use("/tarefas",require("./src/routes/tarefas.routes"));
app.use("/recompensas",require("./src/routes/recompensas.routes"));
app.use("/consulta",require("./src/routes/consulta.routes"));
app.use("/psicologo",require("./src/routes/psicologo.routes"));
app.use("/paciente",require("./src/routes/paciente.routes"));

app.use((err,req,res,next)=> {
    console.error(err);
    res.status(500).json( {
        mensagem:"Erro interno do servidor"
    }
    );
}
);
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`Servidor rodando na porta ${PORT}`));
