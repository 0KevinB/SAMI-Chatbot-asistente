from django.db import models
from django.contrib.auth.models import User

class Medico(models.Model):
    cedula = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100)

    def __str__(self):
        return self.user.get_full_name()

class Paciente(models.Model):
    cedula = models.CharField(max_length=100)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class HistoriaClinica(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='historias_clinicas')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name='historias_clinicas')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    archivo_pdf = models.CharField(max_length=500)  # Almacenará la ruta del archivo en Firebase Storage

    def __str__(self):
        return f"Historia de {self.paciente} - {self.fecha_creacion}"