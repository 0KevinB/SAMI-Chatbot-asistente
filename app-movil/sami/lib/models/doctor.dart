class Doctor {
  final String id;
  final String cedula;
  final String nombre;
  final String email;
  final String role;
  final List<String> especialidades;

  Doctor({
    required this.id,
    required this.cedula,
    required this.nombre,
    required this.email,
    required this.role,
    required this.especialidades,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    // Handle the case where especialidades might not be present in the JSON
    List<String> parseEspecialidades() {
      if (json['especialidad'] != null) {
        // If it's a single especialidad
        return [json['especialidad'] as String];
      } else if (json['especialidades'] != null) {
        // If it's a list of especialidades
        if (json['especialidades'] is List) {
          return (json['especialidades'] as List)
              .map((e) => e.toString())
              .toList();
        }
        return [json['especialidades'].toString()];
      }
      // Default to Cardiología if no especialidad is specified
      return ['Cardiología'];
    }

    return Doctor(
      id: json['id'] ?? '',
      cedula: json['cedula'] ?? '',
      nombre: json['nombre'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'medico',
      especialidades: parseEspecialidades(),
    );
  }
}
