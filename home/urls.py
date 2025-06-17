from django.contrib import admin
from django.urls import path, include
from home import views

app_name= 'home'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='index'),
    path('home/', views.home, name='home'),
    path('catalogo/', views.catalogo, name='catalogo'),
    path('product/', views.product, name='product'),
    path('scanner/',views.scanner,name='scanner'),
    path('profile/',views.profile,name='profile'),
    path('carrito/',views.carrito,name='carrito'),
    path('index/',views.index,name='index'),

    ]