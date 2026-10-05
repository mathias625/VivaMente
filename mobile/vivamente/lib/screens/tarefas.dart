import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../services/session_service.dart';

class Tarefas extends StatefulWidget {
  const Tarefas({
    super.key,
  });

  @override
  State<Tarefas> createState() => _TarefasState();
}

class _TarefasState extends State<Tarefas> {
  List<dynamic> tarefas = [];
  bool carregando = true;
  String? erro;
  int? tarefaAtualizando;

  @override
  void initState() {
    super.initState();
    carregarTarefas();
  }

  Future<void> carregarTarefas() async {
    try {
      final token = await SessionService.getToken();

      if (token == null) {
        throw Exception("Sessão não encontrada");
      }

      final dados = await ApiService.listarTarefas(token);

      if (!mounted) return;

      setState(() {
        tarefas = dados;
        carregando = false;
        erro = null;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        erro = e.toString().replaceFirst("Exception: ", "");
        carregando = false;
      });
    }
  }

  Future<void> concluirTarefa(int id) async {
    if (tarefaAtualizando != null) return;

    try {
      final token = await SessionService.getToken();

      if (token == null) {
        throw Exception("Sessão não encontrada");
      }

      setState(() {
        tarefaAtualizando = id;
      });

      await ApiService.atualizarTarefa(
        id,
        "concluida",
        token,
      );

      await carregarTarefas();

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Tarefa concluída!"),
        ),
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        tarefaAtualizando = null;
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

  bool tarefaConcluida(dynamic tarefa) {
    return tarefa["status"] == "concluida";
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
          "Minhas Tarefas",
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
                          "Não foi possível carregar suas tarefas.",
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

                            carregarTarefas();
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
              : tarefas.isEmpty
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 90,
                              height: 90,
                              decoration: BoxDecoration(
                                color: const Color(0xFFE8EAF6),
                                borderRadius: BorderRadius.circular(28),
                              ),
                              child: const Icon(
                                Icons.task_alt_rounded,
                                color: Color(0xFF3F51B5),
                                size: 45,
                              ),
                            ),
                            const SizedBox(height: 20),
                            const Text(
                              "Nenhuma tarefa no momento",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 21,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF263238),
                              ),
                            ),
                            const SizedBox(height: 10),
                            const Text(
                              "Quando uma nova tarefa for adicionada, ela aparecerá aqui.",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey,
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  : RefreshIndicator(
                      color: const Color(0xFF3F51B5),
                      onRefresh: carregarTarefas,
                      child: ListView.builder(
                        padding: const EdgeInsets.fromLTRB(
                          24,
                          15,
                          24,
                          30,
                        ),
                        itemCount: tarefas.length,
                        itemBuilder: (context, index) {
                          final tarefa = tarefas[index];
                          final concluida = tarefaConcluida(tarefa);
                          final id = tarefa["id"];
                          final pontos = tarefa["pontos"] ?? 0;
                          final atualizando = tarefaAtualizando == id;

                          return Container(
                            margin: const EdgeInsets.only(
                              bottom: 16,
                            ),
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: concluida
                                  ? const Color(0xFFF1F1F1)
                                  : const Color(0xFFF5F6FF),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: concluida
                                    ? Colors.grey.shade300
                                    : const Color(0xFFE0E3F5),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                Row(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius:
                                            BorderRadius.circular(15),
                                      ),
                                      child: Icon(
                                        concluida
                                            ? Icons.check_circle
                                            : Icons.task_alt_rounded,
                                        color: const Color(0xFF3F51B5),
                                        size: 28,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Text(
                                        tarefa["nome"] ?? "Tarefa",
                                        style: TextStyle(
                                          fontSize: 19,
                                          fontWeight: FontWeight.bold,
                                          color: concluida
                                              ? Colors.grey
                                              : const Color(0xFF263238),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 15),
                                Text(
                                  tarefa["descricao"] ?? "",
                                  style: const TextStyle(
                                    fontSize: 15,
                                    color: Colors.black87,
                                    height: 1.4,
                                  ),
                                ),
                                const SizedBox(height: 15),
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 7,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius:
                                            BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        "+$pontos pontos",
                                        style: const TextStyle(
                                          color: Color(0xFF3F51B5),
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    Text(
                                      concluida
                                          ? "Concluída"
                                          : "Pendente",
                                      style: TextStyle(
                                        color: concluida
                                            ? Colors.grey
                                            : const Color(0xFF3F51B5),
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                                if (!concluida) ...[
                                  const SizedBox(height: 18),
                                  SizedBox(
                                    width: double.infinity,
                                    height: 48,
                                    child: ElevatedButton(
                                      onPressed: atualizando
                                          ? null
                                          : () =>
                                              concluirTarefa(id),
                                      style:
                                          ElevatedButton.styleFrom(
                                        backgroundColor:
                                            const Color(0xFF3F51B5),
                                        disabledBackgroundColor:
                                            Colors.grey[300],
                                        elevation: 0,
                                        shape:
                                            RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(
                                            14,
                                          ),
                                        ),
                                      ),
                                      child: atualizando
                                          ? const SizedBox(
                                              width: 22,
                                              height: 22,
                                              child:
                                                  CircularProgressIndicator(
                                                strokeWidth: 2,
                                                color: Colors.white,
                                              ),
                                            )
                                          : const Text(
                                              "Concluir tarefa",
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 16,
                                                fontWeight:
                                                    FontWeight.bold,
                                              ),
                                            ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}