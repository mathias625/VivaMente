# Vivamente - Backend

## O que foi implementado

- Autenticação por token JWT compatível (HS256) sem depender de biblioteca externa.
- Middleware de autenticação e middleware de autorização por perfil.
- Um service para cada controller: login, paciente, psicólogo, consulta, tarefas e recompensas.
- Regras de acesso para paciente e psicólogo.
- Senhas protegidas com `scrypt` + salt.
- Dados de nome protegidos com AES-256-GCM.
- Loja de recompensas com compra usando pontos.
- Ao concluir uma tarefa, os pontos da tarefa são creditados ao paciente; ao desfazê-la, os pontos são estornados.

## Perfis

### Paciente

- Visualiza somente suas tarefas.
- Atualiza somente o `status` das próprias tarefas.
- Visualiza recompensas e compra com seus pontos.
- Visualiza o próprio psicólogo em `GET /paciente/meu-psicologo`.
- Pode visualizar/atualizar o próprio perfil.

### Psicólogo

- CRUD das consultas, tarefas, recompensas, pacientes e próprio perfil, respeitando a associação dos pacientes.
- Lista somente os pacientes vinculados a ele em `GET /psicologo/meus-pacientes`.
- Pode consultar e administrar os recursos relacionados aos seus pacientes.

## Login

`POST /auth/login`

```json
{
  "email": "usuario@email.com",
  "senha": "senha",
  "tipo": "paciente"
}
```

O retorno contém `token`. Para rotas protegidas, envie:

`Authorization: Bearer <token>`

## Variáveis de ambiente

Configure uma chave forte para `JWT_SECRET` e outra para `DATA_ENCRYPTION_KEY` antes de colocar a aplicação em produção.

## Banco

O projeto continua usando o Prisma e o schema MySQL existente. Rode as migrations normalmente no ambiente de desenvolvimento/produção.

## Observação

O diretório `node_modules` não é distribuído no ZIP final; execute `npm install` antes de iniciar o projeto.
