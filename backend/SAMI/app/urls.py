from django.urls import path
from .views import PDFTextView, PDFListView

urlpatterns = [
    path('pdfs/', PDFListView.as_view(), name='pdf-list'),
    path('pdfs/<int:pk>/text/', PDFTextView.as_view(), name='pdf-text'),
]