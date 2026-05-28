from rest_framework import serializers
from .models import CustomUser, CandidateProfile, Job, Application

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'cpf', 'password', 'is_company']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class CandidateProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    cpf = serializers.CharField(source='user.cpf', read_only=True)

    class Meta:
        model = CandidateProfile
        fields = ['id', 'user', 'name', 'cpf', 'email', 'desired_salary', 'experience', 'education']

class ApplicationSerializer(serializers.ModelSerializer):
    score = serializers.ReadOnlyField()
    candidate_details = CandidateProfileSerializer(source='candidate', read_only=True)
    job_company_id = serializers.IntegerField(source='job.company.id', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_company_id', 'candidate', 'candidate_details', 'created_at', 'score']

class JobSerializer(serializers.ModelSerializer):
    candidates_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'company', 'title', 'salary_range', 'min_education', 'requirements', 'created_at', 'candidates_count']

    def get_candidates_count(self, obj):
        return obj.applications.count()