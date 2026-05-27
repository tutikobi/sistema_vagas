from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models.functions import TruncMonth
from django.db.models import Count
from .models import CustomUser, CandidateProfile, Job, Application
from .serializers import UserSerializer, CandidateProfileSerializer, JobSerializer, ApplicationSerializer

class DashboardReportView(APIView):
    def get(self, request):
        jobs_per_month = Job.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
        apps_per_month = Application.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
        
        return Response({
            'jobs': list(jobs_per_month),
            'applications': list(apps_per_month)
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all()
    serializer_class = CandidateProfileSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer