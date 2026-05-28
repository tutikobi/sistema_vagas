from django.core.management.base import BaseCommand
from vagas.models import CustomUser, CandidateProfile, Job, Application
from decimal import Decimal
from django.utils import timezone
from faker import Faker
import random
import datetime

class Command(BaseCommand):
    help = 'Popula o banco com dezenas de registros realistas usando Faker.'

    def handle(self, *args, **options):
        fake = Faker('pt_BR')
        
        self.stdout.write('Limpando banco de dados...')
        CustomUser.objects.all().delete()
        Job.objects.all().delete()
        Application.objects.all().delete()

        self.stdout.write('Criando contas mestras fixas para o avaliador...')
        
        # Admin e usuários fixos
        CustomUser.objects.create_superuser(email='admin@senior.com.br', name='Super Administrador', cpf='00000000000', password='admin')
        empresa_fixa = CustomUser.objects.create_user(email='empresa@senior.com.br', name='Senior Sistemas', cpf='12345678000199', password='123', is_company=True)
        cand_fixo = CustomUser.objects.create_user(email='candidato@dev.com', name='Arthur Dev', cpf='11122233344', password='123', is_company=False)
        
        perfil_fixo = CandidateProfile.objects.create(
            user=cand_fixo, desired_salary=Decimal('2500.00'),
            experience='Full Stack Developer (Python/React). Experiência com Kanban e integrações.',
            education='superior'
        )

        self.stdout.write('Gerando massa de dados dinâmica com Faker...')
        
        # 1. Criar Empresas Fictícias
        empresas = [empresa_fixa]
        for _ in range(5):
            empresas.append(CustomUser.objects.create_user(
                email=fake.unique.company_email(), name=fake.company(), cpf=fake.cnpj(), password='123', is_company=True
            ))

        # 2. Criar Candidatos Fictícios
        candidatos_perfis = [perfil_fixo]
        opcoes_escolaridade = ['fundamental', 'medio', 'tecnologo', 'superior', 'pos_mba_mestrado', 'doutorado']
        
        for _ in range(30):
            user_cand = CustomUser.objects.create_user(
                email=fake.unique.email(), name=fake.name(), cpf=fake.cpf(), password='123', is_company=False
            )
            perfil = CandidateProfile.objects.create(
                user=user_cand, desired_salary=Decimal(random.randint(1500, 6000)),
                experience=fake.text(max_nb_chars=200), education=random.choice(opcoes_escolaridade)
            )
            candidatos_perfis.append(perfil)

        # 3. Criar Vagas Fictícias no tempo
        vagas_titulos = ['DevOps Engineer (CI/CD)', 'Desenvolvedor Frontend React', 'Engenheiro de Software Python', 'Especialista em Banco de Dados', 'Scrum Master / Agile Coach']
        opcoes_salario = ['ate_1000', '1000_2000', '2000_3000', 'acima_3000']
        vagas = []
        
        for _ in range(15):
            vaga = Job.objects.create(
                company=random.choice(empresas), title=random.choice(vagas_titulos),
                salary_range=random.choice(opcoes_salario), min_education=random.choice(opcoes_escolaridade),
                requirements=fake.text(max_nb_chars=150)
            )
            Job.objects.filter(id=vaga.id).update(created_at=timezone.now() - datetime.timedelta(days=random.randint(0, 150)))
            vagas.append(vaga)

        # 4. Criar Aplicações (Match aleatório)
        for _ in range(60):
            vaga = random.choice(vagas)
            candidato = random.choice(candidatos_perfis)
            if not Application.objects.filter(job=vaga, candidate=candidato).exists():
                app = Application.objects.create(job=vaga, candidate=candidato)
                app_data = vaga.created_at + datetime.timedelta(days=random.randint(0, 10))
                if app_data > timezone.now(): app_data = timezone.now()
                Application.objects.filter(id=app.id).update(created_at=app_data)

        self.stdout.write(self.style.SUCCESS('✨ Ambiente Semeado! 30 candidatos, 15 vagas e dezenas de aplicações gerados.'))