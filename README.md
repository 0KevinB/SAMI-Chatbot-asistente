# SAMMY - Chatbot Asistente Médico para la Diabetes

SAMMY es un chatbot asistente diseñado para ayudar a pacientes y médicos en el seguimiento de la diabetes. El sistema permite cargar historias clínicas, consultarlas de manera eficiente y generar recomendaciones personalizadas basadas en la información médica. Todo esto, con un enfoque en mejorar la calidad de vida de los pacientes y apoyar a los médicos en su práctica diaria.

## 🚀 Características principales

### Gestión de historias clínicas
- Los médicos pueden cargar archivos PDF con datos médicos
- Los pacientes pueden consultar sus historias clínicas en cualquier momento

### Recomendaciones personalizadas
- SAMMY analiza la información médica y genera sugerencias personalizadas usando inteligencia artificial

### Integración con WhatsApp
- Permite una comunicación sencilla y directa con los usuarios

### Privacidad y seguridad
- Cumple con normativas para proteger los datos sensibles de los usuarios

## 🛠️ Tecnologías utilizadas

- **Frontend:** SnatchBot para la creación del flujo conversacional
- **Backend:** Django con Django REST Framework para la gestión de datos y API
- **Base de datos:** Firebase Firestore para almacenamiento en la nube
- **Procesamiento de PDFs:** Librerías como DocumentConverter, PyPDF2, o Tesseract OCR
- **Mensajería:** WhatsApp Business API
- **Inteligencia Artificial:** OpenAI API para generar recomendaciones personalizadas

## 🏗️ Arquitectura del sistema

### Flujo general

#### Médico
1. Carga la historia clínica del paciente (PDF) a través de SAMMY
2. El sistema analiza el documento y extrae los datos relevantes

#### Backend
1. Almacena los PDFs y los datos extraídos en Firebase
2. Genera recomendaciones basadas en reglas predefinidas e IA

#### Paciente
1. Consulta su historia clínica desde WhatsApp mediante comandos simples
2. Recibe recomendaciones personalizadas y consejos médicos

### Diagrama de arquitectura
```
[Usuario (Médico/Paciente)] 
        ↓
    [SnatchBot]
        ↓
   [Django Backend]
        ↓
[Firebase (Base de datos + Almacenamiento)]
        ↓
 [OpenAI API para IA]
```

## 🧩 Metodología de trabajo

### Metodología ágil
Seguiremos un enfoque iterativo e incremental utilizando Scrum:

- Sprints de 2 semanas
- Backlog del producto con prioridades definidas
- Reuniones diarias (15 minutos) para seguimiento
- Entrega de MVP inicial en la primera iteración

### Tareas iniciales
1. Diseñar el flujo del chatbot en SnatchBot
2. Configurar el entorno backend con Django y Firebase
3. Implementar la funcionalidad básica de carga de PDFs
4. Prototipo funcional para la consulta de historias clínicas

## 🌟 Primeros pasos

### 1. Requisitos previos
Asegúrate de tener instalados:
- Python 3.9+ (para el backend)
- Django y Django REST Framework
- Firebase CLI y cuenta en Firebase
- Acceso a la OpenAI API y cuenta en SnatchBot
- Herramientas para la WhatsApp Business API (como Twilio)

### 2. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/SAMMY-Chatbot-asistente.git
cd SAMMY-Chatbot-asistente
```

### 3. Instalar dependencias del backend
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
Crea un archivo `.env` con las siguientes claves:
```env
OPENAI_API_KEY=tu_clave_de_openai
FIREBASE_PROJECT_ID=tu_id_de_firebase
WHATSAPP_API_TOKEN=tu_token_de_whatsapp
```

### 5. Ejecutar el servidor
```bash
python manage.py runserver
```

## 🎯 Próximos pasos
- Finalizar la configuración del flujo en SnatchBot
- Implementar la integración de WhatsApp con la API
- Desarrollar las reglas iniciales para recomendaciones básicas
- Probar el sistema con usuarios reales y recopilar feedback

## 📖 Documentación
Consulta la Wiki del proyecto para obtener más detalles sobre la arquitectura, configuraciones avanzadas y guías para desarrolladores.

## 🤝 Contribuir
¡Nos encantaría recibir tu ayuda! Si tienes ideas o quieres contribuir, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz tus cambios y realiza un commit (`git commit -m "Descripción del cambio"`)
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📧 Contacto
Si tienes preguntas o sugerencias, no dudes en contactarnos:

**Kevin - Creador principal**
- Correo: kevin@ejemplo.com
- LinkedIn: linkedin.com/in/kevin
