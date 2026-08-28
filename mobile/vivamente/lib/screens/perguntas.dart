import 'package:flutter/material.dart';

import 'resultado.dart';

class Perguntas extends StatefulWidget {
  final String nome;

  const Perguntas({
    super.key,
    required this.nome,
  });

  @override
  State<Perguntas> createState() => _PerguntasState();
}

class _PerguntasState extends State<Perguntas> {
  int pontos = 0;
  int perguntaAtual = 0;

  final List<Map<String, dynamic>> perguntas = [
    {
      "pergunta": "Como você se sentiu hoje na escola?",
      "respostas": [
        {
          "texto": "Muito feliz",
          "emoji": "😊",
          "valor": 1,
        },
        {
          "texto": "Normal",
          "emoji": "😐",
          "valor": 2,
        },
        {
          "texto": "Muito triste",
          "emoji": "😔",
          "valor": 3,
        },
      ],
    },
    {
      "pergunta": "Você conseguiu se concentrar?",
      "respostas": [
        {
          "texto": "Sim",
          "emoji": "🎯",
          "valor": 1,
        },
        {
          "texto": "Mais ou menos",
          "emoji": "🤔",
          "valor": 2,
        },
        {
          "texto": "Não",
          "emoji": "😕",
          "valor": 3,
        },
      ],
    },
    {
      "pergunta": "Como está sua motivação?",
      "respostas": [
        {
          "texto": "Alta",
          "emoji": "🚀",
          "valor": 1,
        },
        {
          "texto": "Média",
          "emoji": "🙂",
          "valor": 2,
        },
        {
          "texto": "Baixa",
          "emoji": "😞",
          "valor": 3,
        },
      ],
    },
  ];

  void responder(int valor) {
    pontos += valor;

    if (perguntaAtual < perguntas.length - 1) {
      setState(() {
        perguntaAtual++;
      });
    } else {
      String resultado;

      if (pontos <= 3) {
        resultado = "Você parece estar bem hoje";
      } else if (pontos <= 6) {
        resultado = "Hoje parece estar sendo um dia comum";
      } else {
        resultado =
            "Talvez hoje seja um bom momento para cuidar um pouco mais de você";
      }

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => Resultado(
            nome: widget.nome,
            resultado: resultado,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    double progresso =
        (perguntaAtual + 1) / perguntas.length;

    List<dynamic> respostas =
        perguntas[perguntaAtual]["respostas"];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back,
            color: Color(0xFF3F51B5),
          ),
        ),
        title: const Text(
          "Check-in",
          style: TextStyle(
            color: Color(0xFF3F51B5),
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Olá, ${widget.nome}",
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 15),
              Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Pergunta ${perguntaAtual + 1}",
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF3F51B5),
                    ),
                  ),
                  Text(
                    "${perguntaAtual + 1} de ${perguntas.length}",
                    style: const TextStyle(
                      fontSize: 15,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: progresso,
                  minHeight: 8,
                  backgroundColor: Colors.grey[200],
                  valueColor:
                      const AlwaysStoppedAnimation<Color>(
                    Color(0xFF3F51B5),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              Center(
                child: Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8EAF6),
                    borderRadius: BorderRadius.circular(28),
                  ),
                  child: const Icon(
                    Icons.favorite_outline,
                    color: Color(0xFF3F51B5),
                    size: 50,
                  ),
                ),
              ),
              const SizedBox(height: 28),
              Text(
                perguntas[perguntaAtual]["pergunta"],
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 23,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF263238),
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 30),
              Expanded(
                child: ListView.builder(
                  itemCount: respostas.length,
                  itemBuilder: (context, index) {
                    final resposta = respostas[index];

                    return Padding(
                      padding: const EdgeInsets.only(
                        bottom: 14,
                      ),
                      child: SizedBox(
                        width: double.infinity,
                        height: 64,
                        child: OutlinedButton(
                          onPressed: () {
                            responder(resposta["valor"]);
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor:
                                const Color(0xFFF7F7FC),
                            side: const BorderSide(
                              color: Color(0xFFD9DCF0),
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.circular(16),
                            ),
                          ),
                          child: Row(
                            children: [
                              Text(
                                resposta["emoji"],
                                style: const TextStyle(
                                  fontSize: 27,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Text(
                                resposta["texto"],
                                style: const TextStyle(
                                  color: Color(0xFF263238),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              SizedBox(
                width: double.infinity,
                height: 45,
                child: TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text(
                    "Voltar",
                    style: TextStyle(
                      color: Color(0xFF3F51B5),
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}