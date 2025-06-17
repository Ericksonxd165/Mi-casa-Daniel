from django.shortcuts import render, redirect, HttpResponse
from . forms import UserProviderForm
from django.contrib.auth import authenticate, login, logout
from . models import userProvider
from home.models import UserClient
from django.contrib import messages

# Create your views here.

def adminpanel(request):
    return render(request, 'admin/adminpanel.html')

def registercategory(request):
    return render(request, 'admin/Register-Category.html')

def registeremployee(request):
    return render(request, 'admin/Register-Employee.html')

def registersupplier(request):
    return render(request, 'admin/Register-Supplier.html')

def adminuser(request):
    users = UserClient.objects.all()  # Obtenemos todos los usuarios normales
    providers = userProvider.objects.all()  # Obtenemos todos los proveedores
    context = {
        'users': users,
        'providers': providers,
    }
    return render(request, 'admin/adminusers.html', context)



def adminreports(request):
    return render(request, 'admin/adminreports.html')

def addproduct(request):
    return render(request, 'admin/addproduct.html')

def editproduct(request):
    return render(request, 'admin/editproduct.html')

def signup_provider(request):
    # Inicializa `form` siempre, incluso antes de comprobar el método de la solicitud
    form = None

    if request.method == 'POST':
        form = UserProviderForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('adminuser:adminusers')  # Redirige al panel de administración si es válido
        else:
            print(form.errors)  # Depura los errores aquí
    else:
        form = UserProviderForm()

    return render(request, 'admin/Sign-Up-Provider.html', {'form': form})