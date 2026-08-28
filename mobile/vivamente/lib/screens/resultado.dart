import 'package:flutter/material.dart';

import 'home.dart';

class Resultado extends StatelessWidget {
  final String nome;
  final String resultado;

  const Resultado({
    super.key,
    required this.nome,
    required this.resultado,
  });

  String get emoji {
    if (resultado == "Você parece estar bem hoje") {
      return "😊";
    }

    if (resultado == "Hoje parece estar sendo um dia comum") {
      return "😐";
    }

    return "💙";
  }

  String get mensagem {
    if (resultado == "Você parece estar bem hoje") {
      return "Que bom! Continue cuidando de você e aproveitando os momentos positivos do seu dia.";
    }

    if (resultado == "Hoje parece estar sendo um dia comum") {
      return "Tudo bem ter dias comuns. Continue observando como você se sente e reserve um momento para você.";
    }

    return "Se estiver passando por um momento difícil, conversar com alguém de confiança pode ajudar. Você não precisa lidar com tudo sozinho.";
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
                "Obrigado por reservar um momento para você, $nome.",
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
                      resultado,
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
              const SizedBox(height: 35),
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (context) => Home(
                          nome: nome,
                        ),
                      ),
                      (route) => false,
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3F51B5),
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
                  onPressed: () {
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