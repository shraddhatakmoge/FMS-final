from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_batches, name='get_batches'),             # GET /api/batches/
    path('add/', views.add_batch, name='add_batch'),             # POST /api/batches/add/
    path('<int:pk>/update/', views.update_batch, name='update_batch'),  # PUT /api/batches/1/update/
]
