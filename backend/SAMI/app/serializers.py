from rest_framework import serializers
from .models import Medico, Paciente, HistoriaClinica
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields = ['user', 'especialidad']

    def create(self, validated_data):
        # Crear un nuevo usuario
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)  # Crea el usuario

        # Crear el médico
        medico = Medico.objects.create(user=user, **validated_data)
        return medico
    
class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id','cedula', 'nombre', 'apellido', 'fecha_nacimiento']

class HistoriaClinicaSerializer(serializers.ModelSerializer):
    medico = MedicoSerializer(read_only=True)
    paciente = PacienteSerializer(read_only=True)

    class Meta:
        model = HistoriaClinica
        fields = ['id', 'paciente', 'medico', 'fecha_creacion', 'archivo_pdf']

class HistoriaClinicaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriaClinica
        fields = ['paciente', 'archivo_pdf']