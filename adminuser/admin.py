from django.contrib import admin
from . models import userProvider
from home.models import UserClient
# from shop.models import Supplier


# Register your models here.

@admin.register(userProvider)
class UserAdmin(admin.ModelAdmin):
    list_display = ('DNI', 'RIF', 'Name', 'Last_Name', 'Email', 'Phone_Number',)
    search_fields = ('DNI', 'Name', 'Last_Name', 'Email',)
    list_filter = ('Country', 'Postal',)

@admin.register(UserClient)
class UserAdmin(admin.ModelAdmin):
    list_display = ('DNI', 'Name', 'Last_Name', 'Email', 'Phone_Number',)
    search_fields = ('DNI', 'Name', 'Last_Name', 'Email',)
    list_filter = ('Country', 'Postal',)
    
# @admin.register(Supplier)
# class SupplierAdmin(admin.ModelAdmin):
#     list_display = ('dni', 'name', 'email', 'active', 'registration_date')
#     search_fields = ('dni', 'name', 'email', 'address')
#     list_filter = ('active', 'registration_date')
#     list_editable = ('active',)
#     ordering = ('name',)
    
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