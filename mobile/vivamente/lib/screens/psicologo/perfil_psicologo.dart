import 'package:flutter/material.dart';

import '../../services/api_service.dart';
import '../../services/session_service.dart';
import '../login.dart';

class PerfilPsicologo extends StatefulWidget {
  const PerfilPsicologo({super.key});

  @override
  State<PerfilPsicologo> createState() => _PerfilPsicologoState();
}

class _PerfilPsicologoState extends State<PerfilPsicologo> {
  Map<String, dynamic>? psicologo;
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
      if (id == null || token == null) throw Exception("Sessão não encontrada");
      final nome = await SessionService.getNome();
      final email = await SessionService.getEmail();
      final dados = await ApiService.buscarPsicologo(id, token);
      if (!mounted) return;
      setState(() {
        psicologo = {
          "id": dados["id"],
          "nome": nome ?? dados["nome"],
          "email": email ?? dados["email"],
          "pacientes": dados["pacientes"],
          "consultas": dados["consultas"],
        };
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

  Future<void> sair() async {
    if (saindo) return;
    setState(() => saindo = true);
    await SessionService.limparSessao();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const Login()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text("Meu Perfil", style: TextStyle(
          color: Color(0xFF3F51B5), fontSize: 24, fontWeight: FontWeight.bold,
        )),
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
              : ListView(
                  padding: const EdgeInsets.all(24),
                  children: [
                    const SizedBox(height: 12),
                    Center(child: Container(
                      width: 105, height: 105,
                      decoration: BoxDecoration(color: const Color(0xFFE8EAF6), borderRadius: BorderRadius.circular(32)),
                      child: const Icon(Icons.medical_services_outlined, color: Color(0xFF3F51B5), size: 55),
                    )),
                    const SizedBox(height: 18),
                    Text(psicologo?["nome"] ?? "Psicólogo", textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold, color: Color(0xFF263238))),
                    const SizedBox(height: 7),
                    Text(psicologo?["email"] ?? "", textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 15, color: Colors.grey)),
                    const SizedBox(height: 28),
                    _Informacao(icone: Icons.person_outline, titulo: "Nome completo", valor: psicologo?["nome"] ?? "Não informado"),
                    const SizedBox(height: 12),
                    _Informacao(icone: Icons.email_outlined, titulo: "E-mail", valor: psicologo?["email"] ?? "Não informado"),
                    const SizedBox(height: 28),
                    SizedBox(height: 52, child: ElevatedButton.icon(
                      onPressed: saindo ? null : sair,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF3F51B5),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      ),
                      icon: saindo
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Icon(Icons.logout),
                      label: Text(saindo ? "Saindo..." : "Sair da conta"),
                    )),
                  ],
                ),
    );
  }
}

class _Informacao extends StatelessWidget {
  final IconData icone;
  final String titulo;
  final String valor;
  const _Informacao({required this.icone, required this.titulo, required this.valor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(17),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Row(children: [
        Icon(icone, color: const Color(0xFF3F51B5), size: 27),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(titulo, style: const TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 5),
          Text(valor, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
        ])),
      ]),
    );
  }
}
