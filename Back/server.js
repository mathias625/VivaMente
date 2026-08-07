require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const tarefasRoutes = require('./src/routes/tarefas.routes');

app.use('/tarefas', tarefasRoutes);


const recompensasRoutes = require('./src/routes/recompensas.routes');

app.use('/recompensas', recompensasRoutes);


const consultaRoutes = require('./src/routes/consulta.routes');

app.use('/consulta', consultaRoutes);


const psicologoRoutes = require('./src/routes/psicologo.routes');

app.use('/psicologo', psicologoRoutes);


const pacienteRoutes = require('./src/routes/paciente.routes');

app.use('/paciente', pacienteRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
