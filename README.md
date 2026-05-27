 Sistema de Gestão de Vagas e Recrutamento

Plataforma full-stack desenvolvida para gestão de processos seletivos. O sistema abrange a criação de vagas por empresas, aplicações de candidatos, análise automática de aderência (Match Score) e relatórios visuais (Dashboard).

 Arquitetura e Tech Stack
Foi adotada uma arquitetura desacoplada para garantir escalabilidade e separação de responsabilidades (Frontend focado em UI e Backend focado em regras de negócio).
- **Backend:** Python, Django 4+, Django REST Framework, SQLite (Embarcado).
- **Frontend:** Node.js, React, Vite, Chart.js.
- **Ferramentas Adicionais:** Jazzmin (Admin UI), Faker (Seed de Banco de Dados).

 Funcionalidades Entregues
- [x] **Login Customizado:** Autenticação exclusiva por `email` (remoção total da dependência de `username`).
- [x] **Nested Serializers:** A listagem de vagas retorna a contagem de candidatos e seus perfis detalhados numa única requisição HTTP (evitando N+1 queries).
- [x] **Match Score (Bônus):** Algoritmo no backend que calcula em tempo real a aderência do candidato à vaga (0 a 2 pontos) cruzando pretensão salarial e escolaridade.
- [x] **Test-Driven Development (TDD):** Cobertura de testes unitários validando as regras do Match Score.
- [x] **Database Seeding:** Comando customizado para popular o sistema com massa de dados orgânica para avaliação do dashboard gráfico.

---

 Guia Rápido de Execução Local (Reprodutibilidade)

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Python 3.10+**
- **Node.js 18+**

### 1. Servidor de API (Backend)
No terminal do projeto, navegue até a pasta correspondente:
```bash
cd sistema_vagas

# Crie e ative o ambiente virtual
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux

# Instale os pacotes necessários
pip install -r requirements.txt

# Aplique o esquema relacional do banco de dados
python manage.py makemigrations vagas
python manage.py migrate

# ⚡ Semeamento Dinâmico de Dados (Uso do Faker para Dashboard)
python manage.py seed

# Inicialize o serviço backend
python manage.py runserver

# Acessos Fixos do Sistema:
Para visualizar o Painel Administrativo Moderno acesse http://localhost:8000/admin/
Superusuário: admin@senior.com.br | Senha: admin




# Rodando a Interface (Frontend)
Abra um novo terminal na pasta raiz e execute:

cd frontend-vagas

# Instale as dependências do ecossistema React
npm install

# Inicie o servidor de desenvolvimento
npm run dev

Acesse a pagina de login e cadastro de usuario, onde o usuario consegue se candidatar a vaga : http://localhost:5173/




Executando a Suíte de Testes
Para validar a integridade mecânica do cálculo de Match Score, rode no terminal do backend:

python manage.py test vagas


