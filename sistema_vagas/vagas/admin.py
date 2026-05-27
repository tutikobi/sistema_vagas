from django.contrib import admin
from .models import CustomUser, CandidateProfile, Job, Application

admin.site.register(CustomUser)
admin.site.register(CandidateProfile)
admin.site.register(Job)
admin.site.register(Application)