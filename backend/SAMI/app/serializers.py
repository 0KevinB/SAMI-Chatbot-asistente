from rest_framework import serializers
from .models import PDF

class PDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDF
        fields = ['id', 'title', 'firebase_path', 'uploaded_at']
        
class PDFFileSerializer(serializers.Serializer):
    name = serializers.CharField()
    path = serializers.CharField()
    updated = serializers.DateTimeField()

class PDFTextSerializer(serializers.Serializer):
    text = serializers.CharField()