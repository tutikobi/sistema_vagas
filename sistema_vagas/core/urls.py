from django.contrib import admin
from django.urls import path, include # <- Não esqueça de importar o include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('vagas.urls')), # <- Adicione esta linha
]