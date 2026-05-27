from rest_framework import serializers
from .models import CustomUser, CandidateProfile, Job, Application

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password', 'is_company']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class CandidateProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = ['id', 'user', 'email', 'desired_salary', 'experience', 'education']
    
   

class ApplicationSerializer(serializers.ModelSerializer):
    score = serializers.ReadOnlyField()
    candidate_details = CandidateProfileSerializer(source='candidate', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'candidate', 'candidate_details', 'created_at', 'score']
        
class JobSerializer(serializers.ModelSerializer):
    candidates_count = serializers.SerializerMethodField()
    applications = ApplicationSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = '__all__'

    def get_candidates_count(self, obj):
        return obj.applications.count()