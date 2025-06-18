from django.contrib import admin
from home.models import UserClient
from shop.models import Supplier
from adminuser.models import Supplier, Employee 
# Register your models here.
from .models import Administrator

@admin.register(Administrator)
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ('username', 'is_admin')  # columnas visibles en la lista
    list_filter = ('is_admin',)              # filtro lateral por si es admin
    search_fields = ('username',)            # barra de búsqueda por username

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('dni', 'first_name', 'last_name', 'email', 'phone_number', 'registration_date')
    search_fields = ('dni', 'first_name', 'last_name', 'email')
    list_filter = ('registration_date',)
    ordering = ('first_name',)

@admin.register(UserClient)
class UserAdmin(admin.ModelAdmin):
    list_display = ('DNI', 'Name', 'Last_Name', 'Email', 'Phone_Number',)
    search_fields = ('DNI', 'Name', 'Last_Name', 'Email',)
    list_filter = ('Country', 'Postal',)
    
@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('dni', 'name', 'email', 'active', 'registration_date')
    search_fields = ('dni', 'name', 'email', 'address')
    list_filter = ('active', 'registration_date')
    list_editable = ('active',)
    ordering = ('name',)
    
    # Campos mostrados en el formulario de edición
    fieldsets = (
        (None, {
            'fields': ('name', 'dni', 'email', 'active')
        }),
        ('Additional Info', {
            'fields': ('address',),
            'classes': ('collapse',)  # Opcional: hace que esta sección sea colapsable
        }),
    )