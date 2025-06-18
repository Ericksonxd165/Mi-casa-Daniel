from django.contrib import admin
from django.urls import path
from home import views

app_name= 'home'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('home/', views.home, name='home'),
    path('catalogo/', views.catalogo, name='catalogo'),
    path('product/', views.product, name='product'),
    path('scanner/',views.scanner,name='scanner'),
    path('profile/',views.profile,name='profile'),
    path('carrito/',views.carrito,name='carrito'),
    path('index/',views.index,name='index'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('product/<int:id>/<slug:slug>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('api/product/<int:product_id>/', views.get_product_json, name='get_product_json'),
    path('api/orders/', views.api_orders, name='api_orders'),
]
