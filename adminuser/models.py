from django.db import models
from django.core.validators import RegexValidator
# Create your models here.


class Supplier(models.Model):
    name = models.CharField(max_length=100, verbose_name="Name")
    address = models.TextField(verbose_name="Address")
    dni = models.CharField(
        max_length=20, 
        verbose_name="DNI",
        unique=True,  # Para asegurar que no haya duplicados
        help_text="National Document ID"
    )
    email = models.EmailField(verbose_name="Email")
    registration_date = models.DateTimeField(auto_now_add=True, verbose_name="Register Date")
    active = models.BooleanField(default=True, verbose_name="Active")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Supplier"
        verbose_name_plural = "Suppliers"
        ordering = ['name']


class Employee(models.Model):
    dni = models.CharField(max_length=15, unique=True, verbose_name="DNI")
    first_name = models.CharField(max_length=100, verbose_name="First Name")
    last_name = models.CharField(max_length=100, verbose_name="Last Name")
    phone_number = models.CharField(max_length=11, verbose_name="Phone Number")
    email = models.EmailField(unique=True, verbose_name="Email")
    address = models.TextField(verbose_name="Address")
    registration_date = models.DateTimeField(auto_now_add=True, verbose_name="Registration Date")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"


# Modelo administrador
class Administrator(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username