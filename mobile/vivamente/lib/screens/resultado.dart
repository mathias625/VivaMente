import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../services/session_service.dart';
import 'home.dart';

class Resultado extends StatefulWidget {
  final String nome;
  final String resultado;

  const Resultado({
    super.key,
    required this.nome,
    required this.resultado,
  });

  @override
  State<Resultado> createState() => _ResultadoState();
}

class _ResultadoState extends State<Resultado> {
  bool registrando = true;
  String? erro;

  String get emoji {
    if (widget.resultado == "Você parece estar bem hoje") {
      return "😊";
    }

    if (widget.resultado == "Hoje parece estar sendo um dia comum") {
      return "😐";
    }

    return "💙";
  }

  String get mensagem {
    if (widget.resultado == "Você parece estar bem hoje") {
      return "Que bom! Continue cuidando de você e aproveitando os momentos positivos do seu dia.";
    }

    if (widget.resultado == "Hoje parece estar sendo um dia comum") {
      return "Tudo bem ter dias comuns. Continue observando como você se sente e reserve um momento para você.";
    }

    return "Se estiver passando por um momento difícil, conversar com alguém de confiança pode ajudar. Você não precisa lidar com tudo sozinho.";
  }

  @override
  void initState() {
    super.initState();
    registrarCheckin();
  }

  Future<void> registrarCheckin() async {
    try {
      final id = await SessionService.getId();
      final token = await SessionService.getToken();

      if (id == null || token == null) {
        throw Exception("Sessão não encontrada");
      }

      await ApiService.registrarCheckin(id, token);

      if (!mounted) return;

      setState(() {
        registrando = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        registrando = false;
        erro = e.toString().replaceFirst("Exception: ", "");
      });
    }
  }

  void voltarParaHome() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (context) => Home(
          nome: widget.nome,
        ),
      ),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 35),
              Container(
                width: 125,
                height: 125,
                decoration: BoxDecoration(
                  color: const Color(0xFFE8EAF6),
                  borderRadius: BorderRadius.circular(38),
                ),
                child: Center(
                  child: Text(
                    emoji,
                    style: const TextStyle(
                      fontSize: 65,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 28),
              const Text(
                "Check-in concluído!",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 29,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF3F51B5),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                "Obrigado por reservar um momento para você, ${widget.nome}.",
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 30),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F6FF),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: const Color(0xFFE0E3F5),
                  ),
                ),
                child: Column(
                  children: [
                    const Text(
                      "Seu momento de hoje",
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      widget.resultado,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF3F51B5),
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8EAF6),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.lightbulb_outline,
                      color: Color(0xFF3F51B5),
                      size: 30,
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        mensagem,
                        style: const TextStyle(
                          fontSize: 15,
                          color: Colors.black87,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 25),
              if (registrando)
                const Column(
                  children: [
                    CircularProgressIndicator(
                      color: Color(0xFF3F51B5),
                    ),
                    SizedBox(height: 12),
                    Text(
                      "Salvando seu check-in...",
                      style: TextStyle(
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              if (erro != null)
                Column(
                  children: [
                    const Icon(
                      Icons.error_outline,
                      color: Color(0xFF3F51B5),
                      size: 35,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      erro!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 15),
                  ],
                ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: registrando ? null : voltarParaHome,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3F51B5),
                    disabledBackgroundColor: Colors.grey[300],
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text(
                    "Voltar para Home",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                  onPressed: registrando
                      ? null
                      : () {
                          Navigator.pop(context);
                        },
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(
                      color: Color(0xFF3F51B5),
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text(
                    "Refazer check-in",
                    style: TextStyle(
                      color: Color(0xFF3F51B5),
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 25),
              const Text(
                "O VivaMente é uma ferramenta de acompanhamento e não substitui a ajuda de profissionais.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}