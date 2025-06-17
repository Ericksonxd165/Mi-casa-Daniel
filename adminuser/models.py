from django.db import models
from django.core.validators import RegexValidator
# Create your models here.

class userProvider(models.Model):
    # Campos de texto
    DNI = models.PositiveIntegerField(unique=True)
    RIF = models.PositiveIntegerField(unique=True)
    Name = models.CharField(max_length=50)
    Last_Name = models.CharField(max_length=50)
    Country = models.CharField(max_length=50)
    Email = models.EmailField(unique=True)
    Phone_Number= models.BigIntegerField(unique=True)
    Postal = models.IntegerField(default="000000")
    Address = models.CharField(max_length=50)
    User = models.CharField(max_length=50)
    Password = models.CharField(max_length=12)

    # Campo de roles
    ROLE_CHOICES = [
        ('defaultuser', 'Usuario'),
        ('admin', 'Administrador'),
        ('worker', 'Trabajador'),
        ('provider', 'Proveedor'),
    ]
    Role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='worker')

    def __str__(self):
        return f"{self.Name} ({self.Role})"

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
