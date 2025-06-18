from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
      path('save_order/', views.save_order, name='save_order'),
    path('save_invoice/', views.save_invoice, name='save_invoice'),
    path('api/orders/', views.get_orders, name='get_orders'),
    path('api/order/<str:order_id>/', views.get_order, name='get_order'),
    path('api/invoice/<str:order_id>/', views.get_invoice, name='get_invoice'),
    path('', views.product_list, name='product_list'),
    path('<slug:category_slug>/', views.product_list, name='product_list_by_category'),
    path('product/<int:id>/<slug:slug>/', views.adminproduct_detail, name='adminproduct_detail'),
    path('product/<int:id>/<slug:slug>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('api/product/<int:product_id>/', views.get_product_json, name='get_product_json'),
    # API endpoints for orders
    path('<slug:category_slug>/', views.product_list, name='product_list_by_category'),
    path('search_suggestions/', views.search_suggestions, name='search_suggestions'),
]
