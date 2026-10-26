VivaMente — lib Flutter corrigida

Estrutura
- lib/screens/Paciente/: telas exclusivas do paciente (home, perfil, resultado, chat, perguntas e tarefas).
- lib/screens/psicologo/: telas exclusivas do psicólogo.
- lib/screens/: login e splash compartilhados.
- lib/services/: API e sessão.

Configuração da API
O endereço padrão continua sendo http://10.0.2.2:3000, adequado ao Android Emulator quando o backend roda no computador.

Flutter Web: flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:3000
Android Emulator: flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000
Celular físico: use o IP local do computador, por exemplo --dart-define=API_BASE_URL=http://192.168.0.10:3000 (substitua pelo IP real). O celular e o computador devem estar na mesma rede.

O backend precisa estar iniciado na porta 3000. No diretório Back, execute npm install e npm run dev, com MySQL/Prisma configurados.

Observações encontradas no backend enviado
1. O backend não possui a rota POST /paciente/checkin, então o fluxo de resultado não chama mais essa rota inexistente.
2. O serviço de login chama descriptografar(usuario.email), mas os serviços de cadastro armazenam email como texto puro (data.email). Isso pode fazer o login falhar no backend. Corrija Back/src/services/login.services.js para retornar email: usuario.email, em vez de descriptografar(usuario.email), caso os registros estejam armazenados em texto puro.
3. A mensagem ClientFailed to fetch indica falha de conexão/URL, não credenciais inválidas. Confirme que a URL corresponde ao alvo (emulador, web ou celular) e que o servidor está rodando.

Dependências usadas: http e shared_preferences.
