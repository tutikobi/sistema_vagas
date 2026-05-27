from rest_framework import serializers
from .models import CustomUser, CandidateProfile, Job, Application

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password', 'is_company']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            is_company=validated_data.get('is_company', False)
        )
        return user

class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    # O React vai precisar ler a pontuação (score) do candidato!
    score = serializers.ReadOnlyField() 
    
    class Meta:
        model = Application
        fields = '__all__'