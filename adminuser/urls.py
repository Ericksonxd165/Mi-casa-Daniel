from django.contrib import admin
from django.urls import path
from adminuser import views

app_name= 'adminuser'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('adminpanel', views.adminpanel, name='adminpanel'),
    path('adminusers/', views.adminuser, name='adminusers'),
    path('adminreports/', views.adminreports, name='adminreports'),
    path('addproduct/', views.addproduct, name='addproduct'),
    path('editproduct/', views.editproduct, name='editproduct'),
    path('signup_provider/', views.signup_provider, name='signup_provider'),
    path('registercategory/', views.registercategory, name='registercategory'),
    path('registeremployee/', views.registeremployee, name='registeremployee'),
    path('registersupplier/', views.registersupplier, name='registersupplier'),
    path('', views.adminpanel, name='adminpanel'),
    
# registeremployee
#     return render(request, 'admin/Register-Employee.html')
# registersupplier
     ]