import 'package:flutter/material.dart';

import '../../services/api_service.dart';
import '../../services/session_service.dart';

class ChatToquinho extends StatefulWidget {
  const ChatToquinho({super.key});

  @override
  State<ChatToquinho> createState() => _ChatToquinhoState();
}

class _ChatToquinhoState extends State<ChatToquinho> {
  final TextEditingController mensagemController = TextEditingController();
  final ScrollController scrollController = ScrollController();
  List<dynamic> mensagens = [];
  int? conversaId;
  bool carregando = true;
  bool enviando = false;
  String? erro;

  @override
  void initState() {
    super.initState();
    iniciarChat();
  }

  Future<String> tokenValido() async {
    final token = await SessionService.getToken();
    if (token == null) throw Exception("Sessão não encontrada. Entre novamente.");
    return token;
  }

  Future<void> iniciarChat() async {
    try {
      final token = await tokenValido();
      final conversas = await ApiService.listarConversas(token);
      if (conversas.isNotEmpty) {
        conversaId = conversas.first["id"] as int;
        await carregarMensagens(token);
      } else {
        final conversa = await ApiService.criarConversa(token);
        conversaId = conversa["id"] as int;
      }
      if (!mounted) return;
      setState(() {
        carregando = false;
        erro = null;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        carregando = false;
        erro = e.toString().replaceFirst("Exception: ", "");
      });
    }
  }

  Future<void> carregarMensagens(String token) async {
    if (conversaId == null) return;
    final conversa = await ApiService.buscarConversa(conversaId!, token);
    mensagens = List<dynamic>.from(conversa["mensagens"] ?? []);
  }

  Future<void> enviar() async {
    final texto = mensagemController.text.trim();
    if (texto.isEmpty || enviando || conversaId == null) return;

    mensagemController.clear();
    setState(() {
      enviando = true;
      mensagens.add({"tipo": "usuario", "texto": texto});
    });

    try {
      final token = await tokenValido();
      final resposta = await ApiService.enviarMensagem(conversaId!, texto, token);
      if (!mounted) return;
      setState(() {
        mensagens.add({"tipo": "ia", "texto": resposta});
        enviando = false;
      });
      rolarParaFinal();
    } catch (e) {
      if (!mounted) return;
      setState(() {
        enviando = false;
        erro = e.toString().replaceFirst("Exception: ", "");
      });
    }
  }

  void rolarParaFinal() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (scrollController.hasClients) {
        scrollController.animateTo(
          scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    mensagemController.dispose();
    scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Row(children: [
          CircleAvatar(
            backgroundColor: Color(0xFFE8EAF6),
            child: Icon(Icons.favorite_rounded, color: Color(0xFF3F51B5)),
          ),
          SizedBox(width: 12),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text("Toquinho", style: TextStyle(color: Color(0xFF263238), fontSize: 18, fontWeight: FontWeight.bold)),
            Text("Seu apoio emocional", style: TextStyle(color: Colors.grey, fontSize: 12)),
          ]),
        ]),
      ),
      body: carregando
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF3F51B5)))
          : erro != null && conversaId == null
              ? Center(child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const Icon(Icons.cloud_off_outlined, size: 48, color: Color(0xFF3F51B5)),
                    const SizedBox(height: 12),
                    Text(erro!, textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(onPressed: () {
                      setState(() { carregando = true; erro = null; });
                      iniciarChat();
                    }, child: const Text("Tentar novamente")),
                  ]),
                ))
              : Column(children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    color: const Color(0xFFE8EAF6),
                    child: const Text(
                      "Pode conversar comigo sobre o que você está sentindo. Sou uma IA de apoio e não substituo um profissional.",
                      style: TextStyle(color: Color(0xFF303F70), fontSize: 12, height: 1.4),
                    ),
                  ),
                  Expanded(
                    child: mensagens.isEmpty
                        ? const Center(child: Padding(
                            padding: EdgeInsets.all(28),
                            child: Column(mainAxisSize: MainAxisSize.min, children: [
                              Icon(Icons.chat_bubble_outline, color: Color(0xFF3F51B5), size: 48),
                              SizedBox(height: 14),
                              Text("Oi! Eu sou o Toquinho.", style: TextStyle(fontSize: 21, fontWeight: FontWeight.bold, color: Color(0xFF263238))),
                              SizedBox(height: 8),
                              Text("O que está passando pela sua cabeça hoje?", textAlign: TextAlign.center, style: TextStyle(color: Colors.black54, fontSize: 15)),
                            ]),
                          ))
                        : ListView.builder(
                            controller: scrollController,
                            padding: const EdgeInsets.all(16),
                            itemCount: mensagens.length,
                            itemBuilder: (context, index) {
                              final item = mensagens[index];
                              final usuario = item["tipo"] == "usuario";
                              return Align(
                                alignment: usuario ? Alignment.centerRight : Alignment.centerLeft,
                                child: Container(
                                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: usuario ? const Color(0xFF3F51B5) : Colors.white,
                                    borderRadius: BorderRadius.circular(18),
                                  ),
                                  child: Text(
                                    item["texto"] ?? "",
                                    style: TextStyle(color: usuario ? Colors.white : const Color(0xFF263238), height: 1.4),
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                  if (enviando)
                    const Padding(
                      padding: EdgeInsets.fromLTRB(16, 0, 16, 8),
                      child: Row(children: [
                        SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF3F51B5))),
                        SizedBox(width: 10),
                        Text("Toquinho está digitando...", style: TextStyle(color: Colors.grey, fontSize: 12)),
                      ]),
                    ),
                  if (erro != null)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 5),
                      child: Text(erro!, style: const TextStyle(color: Colors.red, fontSize: 12)),
                    ),
                  SafeArea(
                    top: false,
                    child: Container(
                      padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
                      color: Colors.white,
                      child: Row(children: [
                        Expanded(child: TextField(
                          controller: mensagemController,
                          minLines: 1,
                          maxLines: 4,
                          textCapitalization: TextCapitalization.sentences,
                          decoration: InputDecoration(
                            hintText: "Escreva sua mensagem...",
                            filled: true,
                            fillColor: const Color(0xFFF3F4F8),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                          ),
                          onSubmitted: (_) => enviar(),
                        )),
                        const SizedBox(width: 8),
                        IconButton(
                          onPressed: enviando ? null : enviar,
                          style: IconButton.styleFrom(backgroundColor: const Color(0xFF3F51B5), foregroundColor: Colors.white),
                          icon: const Icon(Icons.send_rounded),
                        ),
                      ]),
                    ),
                  ),
                ]),
    );
  }
}
