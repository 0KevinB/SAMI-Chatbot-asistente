# app/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Medico, Paciente, HistoriaClinica
from .serializers import MedicoSerializer, PacienteSerializer, HistoriaClinicaSerializer, HistoriaClinicaCreateSerializer
from firebase_admin import storage
import uuid

class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    lookup_field = 'cedula'

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    lookup_field = 'cedula'

class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.all()
    serializer_class = HistoriaClinicaSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        if self.action == 'create':
            return HistoriaClinicaCreateSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        archivo_pdf = request.FILES.get('archivo_pdf')
        if not archivo_pdf:
            return Response({'error': 'No se proporcionó ningún archivo PDF'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            paciente = Paciente.objects.get(cedula=serializer.validated_data['paciente_cedula'])
            medico = Medico.objects.get(cedula=serializer.validated_data['medico_cedula'])
        except (Paciente.DoesNotExist, Medico.DoesNotExist):
            return Response({'error': 'Paciente o Médico no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Subir archivo a Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(f'historias_clinicas/{uuid.uuid4()}.pdf')
        blob.upload_from_file(archivo_pdf)

        # Crear la historia clínica
        historia_clinica = HistoriaClinica.objects.create(
            paciente=paciente,
            medico=medico,
            archivo_pdf=blob.public_url
        )

        return Response(HistoriaClinicaSerializer(historia_clinica).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['GET'])
    def por_paciente(self, request):
        cedula_paciente = request.query_params.get('cedula')
        if not cedula_paciente:
            return Response({'error': 'Se requiere la cédula del paciente'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            paciente = Paciente.objects.get(cedula=cedula_paciente)
        except Paciente.DoesNotExist:
            return Response({'error': 'Paciente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        historias = HistoriaClinica.objects.filter(paciente=paciente)
        serializer = self.get_serializer(historias, many=True)
        return Response(serializer.data)