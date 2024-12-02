# app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicoViewSet, PacienteViewSet, HistoriaClinicaViewSet

router = DefaultRouter()
router.register(r'medicos', MedicoViewSet)
router.register(r'pacientes', PacienteViewSet)
router.register(r'historias-clinicas', HistoriaClinicaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]