import 'package:shared_preferences/shared_preferences.dart';

class SessionService {
  static const String tokenKey = "token";
  static const String idKey = "usuario_id";
  static const String nomeKey = "usuario_nome";
  static const String emailKey = "usuario_email";
  static const String tipoKey = "usuario_tipo";

  static Future<void> salvarSessao(
    Map<String, dynamic> usuario,
    String token,
  ) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(tokenKey, token);
    final rawId = usuario["id"];
    final id = rawId is int ? rawId : int.tryParse(rawId?.toString() ?? "");
    if (id == null) throw Exception("ID do usuário inválido recebido pela API");
    await prefs.setInt(idKey, id);
    await prefs.setString(nomeKey, (usuario["nome"] ?? "").toString());
    await prefs.setString(emailKey, (usuario["email"] ?? "").toString());
    await prefs.setString(tipoKey, (usuario["tipo"] ?? "paciente").toString());
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(tokenKey);
  }

  static Future<int?> getId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(idKey);
  }

  static Future<String?> getNome() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(nomeKey);
  }

  static Future<String?> getEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(emailKey);
  }

  static Future<String?> getTipo() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(tipoKey);
  }

  static Future<void> limparSessao() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(tokenKey);
    await prefs.remove(idKey);
    await prefs.remove(nomeKey);
    await prefs.remove(emailKey);
    await prefs.remove(tipoKey);
  }
}