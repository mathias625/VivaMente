import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../services/session_service.dart';
import 'login.dart';

class Perfil extends StatefulWidget {
  const Perfil({
    super.key,
  });

  @override
  State<Perfil> createState() => _PerfilState();
}

class _PerfilState extends State<Perfil> {
  Map<String, dynamic>? paciente;
  bool carregando = true;
  bool saindo = false;
  String? erro;

  @override
  void initState() {
    super.initState();
    carregarDados();
  }

  Future<void> carregarDados() async {
    try {
      final id = await SessionService.getId();
      final token = await SessionService.getToken();

      if (id == null || token == null) {
        throw Exception("Sessão não encontrada");
      }

      final dados = await ApiService.buscarPaciente(id, token);

      if (!mounted) return;

      setState(() {
        paciente = dados;
        carregando = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        erro = e.toString().replaceFirst("Exception: ", "");
        carregando = false;
      });
    }
  }

  Future<void> sair() async {
    if (saindo) return;

    setState(() {
      saindo = true;
    });

    try {
      await SessionService.limparSessao();

      final token = await SessionService.getToken();
      final id = await SessionService.getId();

      if (token != null || id != null) {
        throw Exception("Não foi possível encerrar a sessão");
      }

      if (!mounted) return;

      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (context) => const Login(),
        ),
        (route) => false,
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        saindo = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst("Exception: ", ""),
          ),
        ),
      );
    }
  }

  int get pontos {
    if (paciente == null || paciente!["pontos"] == null) {
      return 0;
    }

    return paciente!["pontos"];
  }

  int get quantidadeTarefas {
    if (paciente == null || paciente!["tarefas"] == null) {
      return 0;
    }

    return (paciente!["tarefas"] as List).length;
  }

  int get quantidadeConsultas {
    if (paciente == null || paciente!["consultas"] == null) {
      return 0;
    }

    return (paciente!["consultas"] as List).length;
  }

  String get nome {
    return paciente?["nome"] ?? "";
  }

  String get email {
    return paciente?["email"] ?? "";
  }

  String get nomePsicologo {
    if (paciente == null || paciente!["psicologo"] == null) {
      return "Não informado";
    }

    return paciente!["psicologo"]["nome"] ?? "Não informado";
  }

  Widget indicador(
    String valor,
    String titulo,
    IconData icone,
  ) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(
          vertical: 18,
          horizontal: 8,
        ),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          children: [
            Icon(
              icone,
              color: const Color(0xFF3F51B5),
              size: 27,
            ),
            const SizedBox(height: 8),
            Text(
              valor,
              style: const TextStyle(
                fontSize: 23,
                fontWeight: FontWeight.bold,
                color: Color(0xFF3F51B5),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              titulo,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          "Meu Perfil",
          style: TextStyle(
            color: Color(0xFF3F51B5),
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: carregando
          ? const Center(
              child: CircularProgressIndicator(
                color: Color(0xFF3F51B5),
              ),
            )
          : erro != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          color: Color(0xFF3F51B5),
                          size: 50,
                        ),
                        const SizedBox(height: 15),
                        const Text(
                          "Não foi possível carregar o perfil.",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF263238),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          erro!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () {
                            setState(() {
                              carregando = true;
                              erro = null;
                            });

                            carregarDados();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF3F51B5),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          child: const Text(
                            "Tentar novamente",
                            style: TextStyle(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(24, 10, 24, 30),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),
                      Container(
                        width: 110,
                        height: 110,
                        decoration: BoxDecoration(
                          color: const Color(0xFFE8EAF6),
                          borderRadius: BorderRadius.circular(35),
                        ),
                        child: const Icon(
                          Icons.person,
                          color: Color(0xFF3F51B5),
                          size: 60,
                        ),
                      ),
                      const SizedBox(height: 22),
                      Text(
                        nome,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 25,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF263238),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        email,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 30),
                      Row(
                        children: [
                          indicador(
                            pontos.toString(),
                            "Pontos",
                            Icons.stars_rounded,
                          ),
                          const SizedBox(width: 12),
                          indicador(
                            quantidadeTarefas.toString(),
                            "Tarefas",
                            Icons.task_alt_rounded,
                          ),
                          const SizedBox(width: 12),
                          indicador(
                            quantidadeConsultas.toString(),
                            "Consultas",
                            Icons.calendar_month_rounded,
                          ),
                        ],
                      ),
                      const SizedBox(height: 25),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F6FF),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFFE0E3F5),
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 52,
                              height: 52,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(
                                Icons.psychology_outlined,
                                color: Color(0xFF3F51B5),
                                size: 29,
                              ),
                            ),
                            const SizedBox(width: 15),
                            Expanded(
                              child: Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "Psicólogo responsável",
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  const SizedBox(height: 5),
                                  Text(
                                    nomePsicologo,
                                    style: const TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF263238),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 25),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE8EAF6),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.info_outline,
                              color: Color(0xFF3F51B5),
                              size: 28,
                            ),
                            SizedBox(width: 14),
                            Expanded(
                              child: Text(
                                "Seus dados são carregados da sua conta do VivaMente. Continue acompanhando seu progresso pelo aplicativo.",
                                style: TextStyle(
                                  color: Colors.black87,
                                  height: 1.5,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 30),
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: saindo ? null : sair,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF3F51B5),
                            disabledBackgroundColor: Colors.grey[300],
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          child: saindo
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Text(
                                  "Sair da conta",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}