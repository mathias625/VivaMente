import 'package:flutter/material.dart';

import '../../services/api_service.dart';
import '../../services/session_service.dart';
import 'perfil_psicologo.dart';

class HomePsicologo extends StatefulWidget {
  const HomePsicologo({super.key});

  @override
  State<HomePsicologo> createState() => _HomePsicologoState();
}

class _HomePsicologoState extends State<HomePsicologo> {
  List<dynamic> pacientes = [];
  List<dynamic> consultas = [];
  bool carregando = true;
  String? erro;

  @override
  void initState() {
    super.initState();
    carregarDados();
  }

  Future<void> carregarDados() async {
    try {
      final token = await SessionService.getToken();
      if (token == null) throw Exception("Sessão não encontrada");
      final resultados = await Future.wait([
        ApiService.listarPacientesPsicologo(token),
        ApiService.listarConsultas(token),
      ]);
      if (!mounted) return;
      setState(() {
        pacientes = resultados[0] as List<dynamic>;
        consultas = resultados[1] as List<dynamic>;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text("VivaMente", style: TextStyle(
          color: Color(0xFF3F51B5), fontSize: 24, fontWeight: FontWeight.bold,
        )),
        actions: [
          IconButton(
            onPressed: () => Navigator.push(context, MaterialPageRoute(
              builder: (_) => const PerfilPsicologo(),
            )),
            icon: const Icon(Icons.person_outline, color: Color(0xFF3F51B5)),
          ),
        ],
      ),
      body: carregando
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF3F51B5)))
          : erro != null
              ? Center(child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const Icon(Icons.error_outline, size: 48, color: Color(0xFF3F51B5)),
                    const SizedBox(height: 12),
                    Text(erro!, textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(onPressed: () {
                      setState(() { carregando = true; erro = null; });
                      carregarDados();
                    }, child: const Text("Tentar novamente")),
                  ]),
                ))
              : RefreshIndicator(
                  onRefresh: carregarDados,
                  child: ListView(
                    padding: const EdgeInsets.all(22),
                    children: [
                      const Text("Olá, psicólogo(a)!", style: TextStyle(
                        fontSize: 27, fontWeight: FontWeight.bold, color: Color(0xFF263238),
                      )),
                      const SizedBox(height: 7),
                      const Text("Acompanhe seus pacientes e consultas.", style: TextStyle(
                        color: Colors.black54, fontSize: 15,
                      )),
                      const SizedBox(height: 22),
                      Row(children: [
                        Expanded(child: _Indicador(
                          icone: Icons.people_alt_outlined,
                          titulo: "Pacientes",
                          valor: pacientes.length.toString(),
                        )),
                        const SizedBox(width: 14),
                        Expanded(child: _Indicador(
                          icone: Icons.calendar_month_outlined,
                          titulo: "Consultas",
                          valor: consultas.length.toString(),
                        )),
                      ]),
                      const SizedBox(height: 28),
                      const Text("Meus pacientes", style: TextStyle(
                        fontSize: 21, fontWeight: FontWeight.bold, color: Color(0xFF263238),
                      )),
                      const SizedBox(height: 12),
                      if (pacientes.isEmpty)
                        const _Aviso(texto: "Você ainda não possui pacientes cadastrados.")
                      else
                        ...pacientes.map((paciente) => Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: Row(children: [
                            CircleAvatar(
                              backgroundColor: const Color(0xFFE8EAF6),
                              child: Text(
                                (paciente["nome"] ?? "P").toString().substring(0, 1).toUpperCase(),
                                style: const TextStyle(color: Color(0xFF3F51B5), fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(width: 13),
                            Expanded(child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(paciente["nome"] ?? "Paciente", style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16,
                                )),
                                const SizedBox(height: 4),
                                Text(paciente["email"] ?? "", style: const TextStyle(color: Colors.grey)),
                              ],
                            )),
                            const Icon(Icons.chevron_right, color: Colors.grey),
                          ]),
                        )),
                      const SizedBox(height: 18),
                      const Text("Próximas consultas", style: TextStyle(
                        fontSize: 21, fontWeight: FontWeight.bold, color: Color(0xFF263238),
                      )),
                      const SizedBox(height: 12),
                      if (consultas.isEmpty)
                        const _Aviso(texto: "Nenhuma consulta cadastrada.")
                      else
                        ...consultas.map((consulta) {
                          final paciente = consulta["paciente"];
                          final data = DateTime.tryParse(consulta["data"]?.toString() ?? "");
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
                            child: Row(children: [
                              const Icon(Icons.event_available, color: Color(0xFF3F51B5), size: 30),
                              const SizedBox(width: 12),
                              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                Text(paciente?["nome"] ?? "Consulta", style: const TextStyle(fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text(data == null ? "Data não informada" : "${data.day.toString().padLeft(2, '0')}/${data.month.toString().padLeft(2, '0')}/${data.year}"),
                              ])),
                            ]),
                          );
                        }),
                    ],
                  ),
                ),
    );
  }
}

class _Indicador extends StatelessWidget {
  final IconData icone;
  final String titulo;
  final String valor;

  const _Indicador({required this.icone, required this.titulo, required this.valor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
      child: Column(children: [
        Icon(icone, color: const Color(0xFF3F51B5), size: 28),
        const SizedBox(height: 9),
        Text(valor, style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold, color: Color(0xFF3F51B5))),
        const SizedBox(height: 4),
        Text(titulo, style: const TextStyle(color: Colors.grey)),
      ]),
    );
  }
}

class _Aviso extends StatelessWidget {
  final String texto;
  const _Aviso({required this.texto});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Text(texto, style: const TextStyle(color: Colors.black54)),
    );
  }
}
