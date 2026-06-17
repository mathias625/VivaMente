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

  List<Map<String, dynamic>> perguntas = [
    {
      "pergunta": "Como você se sentiu hoje na escola?",
      "respostas": ["Muito feliz", "Normal", "Muito triste"]
    },
    {
      "pergunta": "Você conseguiu se concentrar?",
      "respostas": ["Sim", "Mais ou menos", "Não"]
    },
    {
      "pergunta": "Como está sua motivação?",
      "respostas": ["Alta", "Média", "Baixa"]
    }
  ];

  void responder(int valor) {
    pontos += valor;

    if (perguntaAtual < perguntas.length - 1) {
      setState(() {
        perguntaAtual++;
      });
    } else {
      String resultado = "";

      if (pontos <= 3) {
        resultado = "feliz";
      } else if (pontos <= 6) {
        resultado = "neutro";
      } else {
        resultado = "com indícios de tristeza";
      }

      Navigator.push(
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
    return Scaffold(
      backgroundColor: Colors.white,

      body: Padding(
        padding: EdgeInsets.all(20),

        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,

            children: [

              Text(
                perguntas[perguntaAtual]["pergunta"],
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  color: Color(0xFF3F51B5),
                ),
              ),

              SizedBox(height: 40),

              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue[50],
                  minimumSize: Size(250, 50),
                ),
                onPressed: () => responder(1),
                child: Text(
                  perguntas[perguntaAtual]["respostas"][0],
                  style: TextStyle(color: Colors.black),
                ),
              ),

              SizedBox(height: 15),

              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue[50],
                  minimumSize: Size(250, 50),
                ),
                onPressed: () => responder(2),
                child: Text(
                  perguntas[perguntaAtual]["respostas"][1],
                  style: TextStyle(color: Colors.black),
                ),
              ),

              SizedBox(height: 15),

              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue[50],
                  minimumSize: Size(250, 50),
                ),
                onPressed: () => responder(3),
                child: Text(
                  perguntas[perguntaAtual]["respostas"][2],
                  style: TextStyle(color: Colors.black),
                ),
              ),

              SizedBox(height: 30),

              // 🔙 BOTÃO VOLTAR EMBAIXO
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  elevation: 0,
                  side: BorderSide(color: Color(0xFF3F51B5)),
                  minimumSize: Size(200, 45),
                ),
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text(
                  "Voltar",
                  style: TextStyle(
                    color: Color(0xFF3F51B5),
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