from django.test import TestCase
from .models import CustomUser, CandidateProfile, Job, Application

class MatchScoreTestCase(TestCase):
    def setUp(self):
        
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
            salary_range="2000_3000", 
            min_education="superior", 
            requirements="Python"
        )
        application = Application.objects.create(job=job, candidate=self.profile)
        self.assertEqual(application.score, 2)

    def test_partial_match_score(self):
        """O candidato deve receber 1 ponto se atender apenas ao salário."""
        job = Job.objects.create(
            company=self.company,
            title="Tech Lead",
            salary_range="2000_3000", 
            min_education="doutorado", 
            requirements="Liderança"
        )
        application = Application.objects.create(job=job, candidate=self.profile)
        self.assertEqual(application.score, 1)