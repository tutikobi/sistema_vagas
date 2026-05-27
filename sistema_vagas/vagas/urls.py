from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardReportView, UserViewSet, CandidateProfileViewSet, JobViewSet, ApplicationViewSet

# O DefaultRouter cria automaticamente as rotas de GET, POST, PUT e DELETE!
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'candidates', CandidateProfileViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'applications', ApplicationViewSet)

urlpatterns = [
    path('reports/', DashboardReportView.as_view(), name='dashboard-reports'),
    path('', include(router.urls)), # Inclui todas as rotas do CRUD
]