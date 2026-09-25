# VivaMente 

## Descrição do projeto
Projeto Full Stack focado em saúde mental chamado **VivaMente**, desenvolvido com Node.js e Prisma no backend, e HTML, CSS e JavaScript no frontend, e preparado para futura versão em Flutter(dart).

O sistema permite o gerenciamento de conteúdos de bem-estar, promovendo conversas entre o paciente e chat-bot(Toquinho) e com um profissional da área(psicólogos ou/e psiquiatras). Além disso nele será possível fazer Rodas de conversas, com o host sendo o profissional encarregado, e os pacientes que poderão escolher se irão participar, caso o paciente deseje, poderá escolher se entrará na roda de conversa anonimamente, caso se sinta desconfortável em revelar sua indentidade. Além disso o projeto **Vivamente** terá um sistema de **tasks** e **recompensas**, onde o paciente receberá missões diárias/semanais e poderá, que ao ser concluída, poderá ser trocada por descontos, consultas ou algo de seu interesse que estejá na loja de recompensas.

---

## Tecnologias

### Backend:
- Node.js
- Prisma
- JWT

### Frontend:
- HTML
- CSS
- JavaScript

### Mobile:
- Flutter(Framework - Utiliza ``.dart``)

### Ferramentas:
- VS Code
- Insomnia
- XAMPP ou MariaDB

---

## Funcionalidades

### Pacientes
- Ver seus médicos
- Ver suas consultas
- Solicitar consultas
- Acesso as suas tarefas/missões 
- Loja de recompensas
- Chat-bot (**Toquinho**)

---
### Psicológos
- Cadastrar consultas(caso solicitado)
- Ver pacientes
- Criar rodas de conversa
- Atribiuir tarefas aos pacientes
- Cadastrar os itens da loja de recompensas
- Excluir tarefas
- Excluir itens na loja de rescompensas

---

## Como executar

### Backend
- Clonar repositório (git clone + url)
- Entrar na pasta **Back**
- Instalar dependências:
    ``` cmd
    npm i
    npx prisma migrate dev
    npx prisma generate
    ```
- Teste
---
### Front-end
- Após ativar o back entre na pasta **Front** e ao encontrar o arquivo ``home.html`` execute-o (double tap no arquivo, ou abrir no navegador se tiver aberto do VSCODE)
- Teste
---
### Mobile
- Rode o comando:
    ```
    flutter pub get
    flutter run
    ```
- Escolha o navegador que executará ao executar o comando ``flutter run`` 
- Teste