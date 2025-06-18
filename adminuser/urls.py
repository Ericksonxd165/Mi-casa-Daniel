from django.contrib import admin
from django.urls import path
from adminuser import views
from adminuser.models import Supplier

app_name= 'adminuser'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.adminpanel, name='adminpanel'),
    path('adminpanel', views.adminpanel, name='adminpanel'),
    path('adminusers/', views.adminuser, name='adminusers'),
    path('adminemployee/', views.adminemployee, name='adminemployee'),
    path('adminsupplier/', views.adminsupplier, name='adminsupplier'),
    path('admincategories/', views.admincategory, name='admincategory'),
    path('adminreports/', views.adminreports, name='adminreports'),
    path('addproduct/', views.addproduct, name='addproduct'),

    path('registercategory/', views.registercategory, name='registercategory'),
    path('delete_employee/<int:employee_id>/', views.delete_employee, name='delete_employee'),
    path('delete_supplier/<int:supplier_id>/', views.delete_supplier, name='delete_supplier'),
    path('delete_category/<int:category_id>/', views.delete_category, name='delete_category'),
    path('edit_employee/<int:employee_id>/', views.edit_employee, name='edit_employee'),
    path('edit_supplier/<int:supplier_id>/', views.edit_supplier, name='edit_supplier'),
    path('edit_category/<int:category_id>/', views.edit_category, name='edit_category'),
    path('registeremployee/', views.register_employee, name='registeremployee'),
    path('registersupplier/', views.register_supplier, name='registersupplier'),
    path('adminproducts/', views.adminproducts, name='adminproducts'),
    path('edit_product/<int:product_id>/', views.edit_product, name='edit_product'),
    path('delete_product/<int:product_id>/', views.delete_product, name='delete_product'),
    path('set_primary_image/<int:product_id>/<int:image_id>/', views.set_primary_image, name='set_primary_image'),
    path('delete_image/<int:image_id>/', views.delete_image, name='delete_image'),# registeremployee
#     return render(request, 'admin/Register-Employee.html')
# registersupplier
     path('admin-login/', views.admin_login_view, name='admin_login'),
     path('orden/entregar/<int:order_id>/', views.mark_as_delivered, name='mark_as_delivered'),
     path('orden/eliminar/<int:order_id>/', views.delete_order, name='delete_order'),
     path('api/orders/', views.api_orders, name='api_orders'),
     
     ]