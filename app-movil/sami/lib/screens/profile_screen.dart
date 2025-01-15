import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  final _formKey = GlobalKey<FormState>();

  // Controladores para los campos de texto
  final _nombreController = TextEditingController();
  final _apellidoController = TextEditingController();
  final _cedulaController = TextEditingController();
  final _emailController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _alturaController = TextEditingController();
  final _pesoController = TextEditingController();
  final _fechaNacimientoController = TextEditingController();

  // Controladores para contacto de emergencia
  final _emergenciaNombreController = TextEditingController();
  final _emergenciaRelacionController = TextEditingController();
  final _emergenciaTelefonoController = TextEditingController();

  String _generoSeleccionado = 'masculino';

  @override
  void initState() {
    super.initState();
    _cargarDatosUsuario();
  }

  void _cargarDatosUsuario() {
    // Aquí cargarías los datos reales del usuario
    _nombreController.text = "Kevin Alexander";
    _apellidoController.text = "Barrazueta Quizhpe";
    _cedulaController.text = "1105589426";
    _emailController.text = "kevin010803abq@gmail.com";
    _telefonoController.text = "0962645019";
    _alturaController.text = "184";
    _pesoController.text = "90";
    _fechaNacimientoController.text = "2003-08-01";

    // Datos de contacto de emergencia
    _emergenciaNombreController.text = "María López";
    _emergenciaRelacionController.text = "madre";
    _emergenciaTelefonoController.text = "0987654321";
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _apellidoController.dispose();
    _cedulaController.dispose();
    _emailController.dispose();
    _telefonoController.dispose();
    _alturaController.dispose();
    _pesoController.dispose();
    _fechaNacimientoController.dispose();
    _emergenciaNombreController.dispose();
    _emergenciaRelacionController.dispose();
    _emergenciaTelefonoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF5DABF5),
        title: Text(
          'Mi Perfil',
          style: GoogleFonts.roboto(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          if (!_isEditing)
            IconButton(
              icon: const Icon(Icons.edit, color: Colors.white),
              onPressed: () => setState(() => _isEditing = true),
            ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSectionTitle('Información Personal'),
                _buildTextField(
                  'Nombre',
                  _nombreController,
                  enabled: _isEditing,
                  icon: Icons.person,
                ),
                _buildTextField(
                  'Apellidos',
                  _apellidoController,
                  enabled: _isEditing,
                  icon: Icons.person_outline,
                ),
                _buildTextField(
                  'Cédula',
                  _cedulaController,
                  enabled: _isEditing,
                  icon: Icons.credit_card,
                ),
                _buildTextField(
                  'Email',
                  _emailController,
                  enabled: _isEditing,
                  icon: Icons.email,
                  keyboardType: TextInputType.emailAddress,
                ),
                _buildTextField(
                  'Teléfono',
                  _telefonoController,
                  enabled: _isEditing,
                  icon: Icons.phone,
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                _buildSectionTitle('Datos Médicos'),
                Row(
                  children: [
                    Expanded(
                      child: _buildTextField(
                        'Altura (cm)',
                        _alturaController,
                        enabled: _isEditing,
                        icon: Icons.height,
                        keyboardType: TextInputType.number,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildTextField(
                        'Peso (kg)',
                        _pesoController,
                        enabled: _isEditing,
                        icon: Icons.monitor_weight,
                        keyboardType: TextInputType.number,
                      ),
                    ),
                  ],
                ),
                _buildDateField(
                  'Fecha de Nacimiento',
                  _fechaNacimientoController,
                  enabled: _isEditing,
                  context: context,
                ),
                if (_isEditing)
                  _buildDropdownField(
                    'Género',
                    _generoSeleccionado,
                    ['masculino', 'femenino', 'otro'],
                    (String? value) {
                      if (value != null) {
                        setState(() => _generoSeleccionado = value);
                      }
                    },
                  ),
                if (!_isEditing) _buildInfoField('Género', _generoSeleccionado),
                const SizedBox(height: 16),
                _buildSectionTitle('Contacto de Emergencia'),
                _buildTextField(
                  'Nombre',
                  _emergenciaNombreController,
                  enabled: _isEditing,
                  icon: Icons.contact_emergency,
                ),
                _buildTextField(
                  'Relación',
                  _emergenciaRelacionController,
                  enabled: _isEditing,
                  icon: Icons.family_restroom,
                ),
                _buildTextField(
                  'Teléfono',
                  _emergenciaTelefonoController,
                  enabled: _isEditing,
                  icon: Icons.phone,
                  keyboardType: TextInputType.phone,
                ),
                if (_isEditing)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _isEditing = false;
                              _cargarDatosUsuario(); // Recargar datos originales
                            });
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey,
                            padding: const EdgeInsets.symmetric(horizontal: 32),
                          ),
                          child: const Text('Cancelar'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              // Aquí irían las llamadas para guardar los datos
                              setState(() => _isEditing = false);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content:
                                      Text('Cambios guardados correctamente'),
                                  backgroundColor: Color(0xFF5DABF5),
                                ),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF5DABF5),
                            padding: const EdgeInsets.symmetric(horizontal: 32),
                          ),
                          child: const Text('Guardar'),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Text(
        title,
        style: GoogleFonts.roboto(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: const Color(0xFF5DABF5),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    bool enabled = true,
    IconData? icon,
    TextInputType? keyboardType,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        enabled: enabled,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon:
              icon != null ? Icon(icon, color: const Color(0xFF5DABF5)) : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF5DABF5)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF5DABF5), width: 2),
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Este campo es requerido';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildDateField(
    String label,
    TextEditingController controller, {
    bool enabled = true,
    required BuildContext context,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        enabled: enabled,
        readOnly: true,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon:
              const Icon(Icons.calendar_today, color: Color(0xFF5DABF5)),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF5DABF5)),
          ),
        ),
        onTap: enabled
            ? () async {
                final DateTime? picked = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                );
                if (picked != null) {
                  controller.text = DateFormat('yyyy-MM-dd').format(picked);
                }
              }
            : null,
      ),
    );
  }

  Widget _buildDropdownField(
    String label,
    String value,
    List<String> items,
    void Function(String?) onChanged,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: DropdownButtonFormField<String>(
        value: value,
        items: items.map((String item) {
          return DropdownMenuItem<String>(
            value: item,
            child: Text(item),
          );
        }).toList(),
        onChanged: onChanged,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF5DABF5)),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
