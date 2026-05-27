from django.test import TestCase
from .models import CustomUser, CandidateProfile, Job, Application

class MatchScoreTestCase(TestCase):
    def setUp(self):
        # Setup: Cria os atores do teste
        self.company = CustomUser.objects.create_user(email='empresa@senior.com', password='123', is_company=True)
        self.candidate = CustomUser.objects.create_user(email='candidato@dev.com', password='123')
        
        self.profile = CandidateProfile.objects.create(
            user=self.candidate,
            desired_salary=2500.00,
            experience="Senior Dev",
            education="superior"
        )
        
    def test_perfect_match_score(self):
        """O candidato deve receber 2 pontos se atender ao salário e escolaridade."""
        job = Job.objects.create(
            company=self.company,
            title="Dev Django",
            salary_range="2000_3000", # Salário (2500) atende (+1 ponto)
            min_education="superior", # Escolaridade atende (+1 ponto)
            requirements="Python"
        )
        application = Application.objects.create(job=job, candidate=self.profile)
        self.assertEqual(application.score, 2)

    def test_partial_match_score(self):
        """O candidato deve receber 1 ponto se atender apenas ao salário."""
        job = Job.objects.create(
            company=self.company,
            title="Tech Lead",
            salary_range="2000_3000", # Salário atende (+1 ponto)
            min_education="doutorado", # Escolaridade é inferior (+0 pontos)
            requirements="Liderança"
        )
        application = Application.objects.create(job=job, candidate=self.profile)
        self.assertEqual(application.score, 1)