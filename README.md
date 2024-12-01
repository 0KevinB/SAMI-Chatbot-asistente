# SAMMY - Asistente Virtual para Seguimiento de Diabetes

## 📋 Descripción
SAMMY es un chatbot diseñado para mejorar el seguimiento de pacientes con diabetes, facilitando el acceso a historias clínicas y proporcionando recomendaciones personalizadas mediante inteligencia artificial.

## 🚀 Características Principales
- Acceso a historias clínicas
- Recomendaciones personalizadas usando IA
- Panel web para médicos
- Aplicación movil para pacientes
- Gestión segura de datos médicos

## 🛠️ Tecnologías
- **Backend:** Django
- **Frontend:** Angular
- **Base de Datos:** Firebase
- **IA:** OpenAI API

### Flujo general

#### Médico
1. Carga la historia clínica del paciente (PDF) a través de SAMMY
2. El sistema analiza el documento y extrae los datos relevantes

#### Backend
1. Almacena los PDFs y los datos extraídos en Firebase
2. Genera recomendaciones basadas en reglas predefinidas e IA

#### Paciente
1. Consulta su historia clínica mediante comandos simples
2. Recibe recomendaciones personalizadas y consejos médicos


## ⚙️ Configuración del Proyecto

### Prerrequisitos
- Node.js 16+
- Django 5.1.3
- Angular CLI 18.2.12
- Cuenta en Firebase
- API Key de OpenAI

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/0KevinB/sammy-chatbot.git

# Configurar variables de entorno

## 📱 MVP - Funcionalidades

### Panel Médico (Angular)
- Login/Registro de médicos
- Subida de historias clínicas (PDF)
- Gestión de pacientes

### Chatbot (Flutter)
- Consulta de historia clínica
- Recomendaciones básicas
- Respuestas automatizadas con IA

## 🤝 Contribuir
¡Nos encantaría recibir tu ayuda! Si tienes ideas o quieres contribuir, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz tus cambios y realiza un commit (`git commit -m "Descripción del cambio"`)
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
   
## 📧 Contacto

**Kevin Barrazueta**
- Correo: kabarrazzueta@utpl.edu.ec

**Carolina Alvarado**
- Correo: cdalvarado3@utpl.edu.ec

**Jean Alejo**
- Correo: jgalejo@utpl.edu.ec
