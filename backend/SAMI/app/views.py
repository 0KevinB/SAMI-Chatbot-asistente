import io
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import storage
import PyPDF2
from .models import PDF
from .serializers import PDFTextSerializer, PDFFileSerializer
from rest_framework.permissions import AllowAny
from PyPDF2.errors import PdfReadError

class PDFTextView(APIView):
    def get(self, request, pk):
        try:
            pdf = PDF.objects.get(pk=pk)
        except PDF.DoesNotExist:
            raise Http404

        bucket = storage.bucket()
        blob = bucket.blob(pdf.firebase_path)

        # Descargar el archivo PDF de Firebase Storage
        pdf_file = io.BytesIO()
        try:
            blob.download_to_file(pdf_file)
            pdf_file.seek(0)
        except Exception as e:
            return Response({'error': f'Error descargando el archivo: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Extraer el texto del PDF
        try:
            pdf_reader = PyPDF2.PdfFileReader(pdf_file)
            text = ""
            for page in range(pdf_reader.numPages):
                text += pdf_reader.getPage(page).extractText()
        except PdfReadError as e:
            return Response({'error': f'Error leyendo el archivo PDF: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PDFTextSerializer(data={'text': text})
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PDFListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        bucket = storage.bucket()
        blobs = bucket.list_blobs(prefix='')  # Lista de archivos en el bucket
        
        pdf_files = []
        for blob in blobs:
            if blob.name.lower().endswith('.pdf'):
                pdf_files.append({
                    'name': blob.name.split('/')[-1],
                    'path': blob.name,
                    'updated': blob.updated
                })

        # Usa el serializador para los datos dinámicos
        serializer = PDFFileSerializer(pdf_files, many=True)
        return Response(serializer.data)
