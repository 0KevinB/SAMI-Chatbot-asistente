import io
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import storage
import PyPDF2

from .models import PDF
from .serializers import PDFSerializer, PDFTextSerializer

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
        blob.download_to_file(pdf_file)
        pdf_file.seek(0)

        # Extraer el texto del PDF
        pdf_reader = PyPDF2.PdfFileReader(pdf_file)
        text = ""
        for page in range(pdf_reader.numPages):
            text += pdf_reader.getPage(page).extractText()

        serializer = PDFTextSerializer(data={'text': text})
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PDFListView(APIView):
    def get(self, request):
        pdfs = PDF.objects.all()
        serializer = PDFSerializer(pdfs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PDFSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)