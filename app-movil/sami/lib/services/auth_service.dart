import 'package:shared_preferences/shared_preferences.dart'
    as shared_preferences;
import 'package:jwt_decoder/jwt_decoder.dart';

class AuthService {
  static const String _tokenKey = 'jwt_token';
  static const String _userDataKey = 'user_data';

  static Future<void> saveToken(String token) async {
    final prefs = await shared_preferences.SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);

    // Decodificar el token y extraer el nombre
    Map<String, dynamic> decodedToken = JwtDecoder.decode(token);
    String fullName = decodedToken['nombre'] ?? '';
    String firstName = fullName.trim().split(' ').first;

    await prefs.setString(_userDataKey, firstName);
  }

  static Future<String?> getToken() async {
    final prefs = await shared_preferences.SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<String> getUserName() async {
    final prefs = await shared_preferences.SharedPreferences.getInstance();
    return prefs.getString(_userDataKey) ?? 'Usuario';
  }

  static Future<void> removeToken() async {
    final prefs = await shared_preferences.SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userDataKey);
  }

  static Future<bool> isTokenValid() async {
    final token = await getToken();
    if (token == null) return false;
    return !JwtDecoder.isExpired(token);
  }
}
