from django.contrib import admin
from .models import CustomUser, CandidateProfile, Job, Application

admin.site.site_header = "Portal de Recrutamento"
admin.site.site_title = "Admin"
admin.site.index_title = "Dashboard de Gestão"

class ApplicationInline(admin.TabularInline):
    model = Application
    extra = 0  # Evita mostrar linhas em branco extras
    readonly_fields = ('get_candidate_email', 'get_score', 'created_at')
    fields = ('get_candidate_email', 'get_score', 'created_at')
    can_delete = False  # Impede deletar a aplicação sem querer por aqui
    
    @admin.display(description='Candidato (E-mail)')
    def get_candidate_email(self, obj):
        return obj.candidate.user.email

    @admin.display(description='Pontuação (Bônus)')
    def get_score(self, obj):
        return obj.score
        
    def has_add_permission(self, request, obj):
        # Apenas para leitura, a empresa não deve "inventar" candidatos na vaga
        return False

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_company', 'is_staff', 'is_active')
    list_filter = ('is_company', 'is_staff')
    search_fields = ('email',)
    ordering = ('email',)

@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'desired_salary', 'education')
    list_filter = ('education',)
    search_fields = ('user__email', 'experience')
    
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'salary_range', 'min_education', 'created_at')
    list_filter = ('min_education', 'salary_range', 'created_at')
    search_fields = ('title', 'company__email', 'requirements')
    inlines = [ApplicationInline]  # <-- É AQUI QUE A MÁGICA ACONTECE!
    
@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'get_candidate_email', 'get_score', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('job__title', 'candidate__user__email')
    
    @admin.display(description='Candidato (E-mail)')
    def get_candidate_email(self, obj):
        return obj.candidate.user.email

    @admin.display(description='Pontuação (Bônus)')
    def get_score(self, obj):
        return obj.score