from . forms import UserForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from home.models import UserClient  # Importa el modelo de usuarios normales
from adminuser.models import userProvider  # Importa el modelo de proveedores




# Create your views here.

def home(request):
    return render(request, 'home.html')


def profile(request):
    return render(request, 'profile.html')


def carrito(request):
    return render(request, 'carrito.html')

def index(request):
    return render(request, 'index.html')

def scanner(request):
    return render(request, 'scanner.html')

def catalogo(request):
    return render(request, 'catalogo.html')

def product(request):
    return render(request, 'producto.html')

# def signup(request):
#     # Si el usuario ya está logeado, redirige al home
#     if request.user.is_authenticated:
#         return redirect('home')
    
    # Lógica de registro normal
    # if request.method == 'POST':
    #     form = UserForm(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         return redirect('home:login')  # O redirigir a otra página después del registro
    # else:
    #     form = UserForm()
    
    # return render(request, 'signup.html', {'form': form})


# def login(request):
#     if request.method == 'POST':
#         username = request.POST.get('User')
#         password = request.POST.get('Password')
        
#         user_obj = None  # Inicializa como None para verificar ambos modelos
        
#         # Verifica primero en el modelo `user`
#         try:
#             user_obj = UserClient.objects.get(User=username)
#             print(f"Usuario encontrado en tabla `user`: {user_obj.User}")
#             if user_obj.Password == password:  # Verifica la contraseña
#                 request.session['is_custom_user'] = True  # Marca que es un usuario del modelo `user`
#                 request.session['user_id'] = user_obj.id  # Guarda el ID del usuario
#                 return redirect('home:home')
#             else:
#                 messages.error(request, 'Contraseña incorrecta.')
#                 return render(request, 'login.html')
#         except UserClient.DoesNotExist:
#             print(f"Usuario con nombre '{username}' no encontrado en la tabla `user`.")

#         # Si no está en `user`, verifica en el modelo `userProvider`
#         try:
#             provider_obj = userProvider.objects.get(User=username)
#             print(f"Usuario encontrado en tabla `userProvider`: {provider_obj.User}")
#             if provider_obj.Password == password:  # Verifica la contraseña
#                 request.session['is_provider_user'] = True  # Marca que es un usuario proveedor
#                 request.session['provider_id'] = provider_obj.id  # Guarda el ID del proveedor
#                 return redirect('home:home')  # O redirige a una página específica para proveedores
#             else:
#                 messages.error(request, 'Contraseña incorrecta.')
#         except userProvider.DoesNotExist:
#             print(f"Usuario con nombre '{username}' no encontrado en la tabla `userProvider`.")
#             messages.error(request, 'Usuario no encontrado.')
        
#     return render(request, 'login.html')

# def signout(request):
#     # Elimina la variable de sesión para usuarios del modelo `user`
#     if 'is_custom_user' in request.session:
#         del request.session['is_custom_user']
    
#     logout(request)  # Cierra la sesión del usuario
#     return redirect('home:home')

# def pass_recover(request):
#     return render(request, 'pass_recover.html')