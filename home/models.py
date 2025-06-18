from django.db import models

#importa tus models

class UserClient(models.Model):
    # Campos de texto
    DNI = models.PositiveIntegerField(unique=True)
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


