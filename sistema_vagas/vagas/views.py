from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models.functions import TruncMonth
from django.db.models import Count
from .models import CustomUser, CandidateProfile, Job, Application
from .serializers import UserSerializer, CandidateProfileSerializer, JobSerializer, ApplicationSerializer

class AuthLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        
        if user:
            profile_id = None
            if not user.is_company and hasattr(user, 'candidate_profile'):
                profile_id = user.candidate_profile.id
            return Response({
                'id': user.id,
                'email': user.email,
                'is_company': user.is_company,
                'candidate_profile_id': profile_id
            }, status=status.HTTP_200_OK)
            
        return Response({'error': 'E-mail ou senha incorretos.'}, status=status.HTTP_400_BAD_REQUEST)

class DashboardReportView(APIView):
    def get(self, request):
        jobs_trend = Job.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
        apps_trend = Application.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
        return Response({
            'jobs': list(jobs_trend),
            'applications': list(apps_trend)
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