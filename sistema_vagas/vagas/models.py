from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O e-mail é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200, default='') # Adicionado
    cpf = models.CharField(max_length=20, default='')   # Adicionado
    is_company = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.name} ({self.email})"

# --- Restante do arquivo (CandidateProfile, Job, Application) continua IGUAL ---
class CandidateProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='candidate_profile')
    desired_salary = models.DecimalField(max_digits=10, decimal_places=2)
    experience = models.TextField()
    education = models.CharField(max_length=50)

class Job(models.Model):
    company = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=200)
    salary_range = models.CharField(max_length=50)
    requirements = models.TextField()
    min_education = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='applications')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def score(self):
        pts = 0
        EDUCATION_LEVELS = {'fundamental': 1, 'medio': 2, 'tecnologo': 3, 'superior': 4, 'pos_mba_mestrado': 5, 'doutorado': 6}
        SALARY_RANGES = {'ate_1000': (0, 1000), '1000_2000': (1000, 2000), '2000_3000': (2000, 3000), 'acima_3000': (3000, float('inf'))}
        
        job_min, job_max = SALARY_RANGES.get(self.job.salary_range, (0, 0))
        if job_min <= self.candidate.desired_salary <= job_max:
            pts += 1
            
        if EDUCATION_LEVELS.get(self.candidate.education, 0) >= EDUCATION_LEVELS.get(self.job.min_education, 0):
            pts += 1
            
        return pts