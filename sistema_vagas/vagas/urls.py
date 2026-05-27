from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CandidateProfileViewSet, JobViewSet, ApplicationViewSet, DashboardReportView, AuthLoginView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'candidateprofiles', CandidateProfileViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'applications', ApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reports/', DashboardReportView.as_view()),
    path('login/', AuthLoginView.as_view()),
]