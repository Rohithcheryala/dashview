from django.urls import path

from . import views

urlpatterns = [
    path('dashboard/<str:id>', views.dashboard, name="index"),
    path('dashboard/<str:id>/edit', views.index, name="index"),
    path('dashboard/<str:id>/save', views.preprocess_dataset, name="index"),
    path('dashboard/<str:id>/metadata', views.get_metadata, name="index"),
    path('dashboard/<str:id>/preview', views.get_dashboard_info, name="index"),

    path('upload/', views.index, name="index"),
    path('', views.index, name="index"),


]