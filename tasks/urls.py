from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('register/', views.register_user, name='register'),

    # API endpoints
    path('lists/', views.api_lists, name='api_lists'),
    path('list/<int:list_id>/', views.api_list, name='api_list'),
    path('tasks/', views.api_tasks, name='api_tasks'),
    path('tasks/<int:list_id>/', views.api_tasks, name='api_tasks'),
    path('task/<int:task_id>/', views.api_task, name='api_task'),  
]
