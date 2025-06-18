from django.shortcuts import render, get_object_or_404, redirect 
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from adminuser.models import Supplier, Employee
from shop.models import Category, Product, ProductImage, Order
from home.models import UserClient 
from django.contrib import messages
from adminuser.forms import CategoryForm, SupplierForm, EmployeeForm, ProductForm, ProductImageFormSet, ProductSupplierFormSet
# Create your views here.
from .models import Administrator
from .forms import AdminLoginForm
from .decorators import admin_required
from shop.models import OrderItem  # asegúrate que arriba hayas importado esto




from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Administrator
from .forms import AdminLoginForm

def admin_login_view(request):
    error = False
    if request.method == 'POST':
        form = AdminLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            
            try:
                admin = Administrator.objects.get(username=username, password=password)
                if admin.is_admin:
                    # Guarda en sesión que está autenticado
                    request.session['admin_id'] = admin.id
                    request.session['is_admin'] = admin.is_admin  # Guarda también si es admin
                    return redirect('adminuser:adminpanel')  # Redirección con el nombre de la URL
                else:
                    messages.error(request, "No tienes permisos de administrador.")
                    error = True
            except Administrator.DoesNotExist:
                messages.error(request, "Usuario o contraseña incorrectos.")
                error = True
    else:
        form = AdminLoginForm()
    
    return render(request, 'admin_login.html', {'form': form, 'error': error})


@admin_required
def adminpanel(request):
    return render(request, 'admin/adminpanel.html')

@admin_required
def registercategory(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('/adminuser/adminpanel')  # Redirige al panel de administración
    else:
        form = CategoryForm()
    return render(request, 'admin/Register-Category.html', {'form': form})



@admin_required
def register_employee(request):
    if request.method == 'POST':
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('adminuser:adminpanel')  # Redirige al panel de administración
    else:
        form = EmployeeForm()
    return render(request, 'admin/Register-Employee.html', {'form': form})

@admin_required
def delete_employee(request, employee_id):
    employee = get_object_or_404(Employee, id=employee_id)
    if request.method == 'POST':
        employee.delete()
        messages.success(request, "Empleado eliminado exitosamente.")
        return redirect('adminuser:adminemployee')
    # Opcional: confirmar con un template si se accede vía GET
    return render(request, 'admin/confirm_delete_employee.html', {'employee': employee})

@admin_required
def register_employee(request):
    if request.method == 'POST':
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('adminuser:adminpanel')  # Redirige al panel de administración
        else:
            # Si el formulario no es válido, los errores se pasarán al template
            return render(request, 'admin/Register-Employee.html', {'form': form})
    else:
        form = EmployeeForm()
    return render(request, 'admin/Register-Employee.html', {'form': form})

@admin_required
def register_supplier(request):
    if request.method == 'POST':
        form = SupplierForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('adminuser:adminpanel')
    else:
        form = SupplierForm()
    return render(request, 'admin/Register-Supplier.html', {'form': form})

def adminuser(request):
    users = UserClient.objects.all()  # Obtenemos todos los usuarios normales
    providers = Supplier.objects.all()  # Obtenemos todos los proveedores
    context = {
        'users': users,
        'providers': providers,
    }
    return render(request, 'admin/adminusers.html', context)


@admin_required
def adminreports(request):
    return render(request, 'admin/adminreports.html')

@admin_required
def addproduct(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        image_formset = ProductImageFormSet(request.POST, request.FILES, prefix='images')
        supplier_formset = ProductSupplierFormSet(request.POST, prefix='providers')

        if form.is_valid() and image_formset.is_valid() and supplier_formset.is_valid():
            product = form.save()

            # Guardar imágenes
            image_formset.instance = product
            image_formset.save()

            # Guardar proveedores
            supplier_formset.instance = product
            supplier_formset.save()

            return redirect('adminuser:adminproducts')
        else:
            print("Form errors:", form.errors)
            print("Image formset errors:", image_formset.errors)
            print("Supplier formset errors:", supplier_formset.errors)
    else:
        form = ProductForm()
        image_formset = ProductImageFormSet(prefix='images')
        supplier_formset = ProductSupplierFormSet(prefix='providers')

    suppliers = Supplier.objects.filter(active=True)

    return render(request, 'admin/addproduct.html', {
        'form': form,
        'image_formset': image_formset,
        'supplier_formset': supplier_formset,
        'suppliers': suppliers,
    })


@admin_required
def adminemployee(request):
    # Vista para listar todos los empleados
    employees = Employee.objects.all().order_by('first_name')
    return render(request, 'admin/adminemployee.html', {'employees': employees})

@admin_required
def edit_employee(request, employee_id):
    # Vista para editar los datos de un empleado
    employee = get_object_or_404(Employee, id=employee_id)
    if request.method == 'POST':
        form = EmployeeForm(request.POST, instance=employee)
        if form.is_valid():
            form.save()
            return redirect('adminuser:adminemployee')
    else:
        form = EmployeeForm(instance=employee)
    return render(request, 'admin/edit_employee.html', {'form': form, 'employee': employee})

@admin_required
def adminsupplier(request):
    suppliers = Supplier.objects.all().order_by('name')
    return render(request, 'admin/adminsupplier.html', {'suppliers': suppliers})

@admin_required
def edit_supplier(request, supplier_id):
    # Vista para editar los datos de un empleado
    supplier = get_object_or_404(Supplier, id=supplier_id)
    if request.method == 'POST':
        form = SupplierForm(request.POST, instance=supplier)
        if form.is_valid():
            form.save()
            return redirect('adminuser:adminemployee')
    else:
        form = SupplierForm(instance=supplier)
    return render(request, 'admin/edit_supplier.html', {'form': form, 'supplier': SupplierForm})

@admin_required
def delete_supplier(request, supplier_id):
    supplier = get_object_or_404(Supplier, id=supplier_id)
    if request.method == 'POST':
        supplier.delete()
        messages.success(request, "Provider Deleted successfully.")
        return redirect('adminuser:adminsupplier')
    # Si se accede por GET, puedes mostrar un template de confirmación (opcional)
    return render(request, 'admin/confirm_delete_supplier.html', {'supplier': supplier})


@admin_required
def admincategory(request):
    categories = Category.objects.all().order_by('name')
    return render(request, 'admin/admincategories.html', {'categories': categories})

@admin_required
def edit_category(request, category_id):
    # Vista para editar los datos de un empleado
    category = get_object_or_404(Category, id=category_id)
    if request.method == 'POST':
        form = CategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            return redirect('adminuser:admincategory')
    else:
        form = CategoryForm(instance=category)
    return render(request, 'admin/edit_category.html', {'form': form, 'category': CategoryForm})

@admin_required
def delete_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    if request.method == 'POST':
        category.delete()
        messages.success(request, "Category Deleted Successfully.")
        return redirect('adminuser:admincategory')
    # Si se accede por GET, puedes mostrar un template de confirmación (opcional)
    return render(request, 'admin/confirm_delete_category.html', {'category': category})


@admin_required
def adminproducts(request):
    products = Product.objects.all().order_by('name')
    orders = Order.objects.prefetch_related('items__product', 'items__supplier').all().order_by('-created_at')
    return render(request, 'admin/adminproducts.html', {'products': products, 'orders': orders})
    

@admin_required
def edit_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        image_formset = ProductImageFormSet(request.POST, request.FILES, instance=product, prefix='images')
        supplier_formset = ProductSupplierFormSet(request.POST, instance=product, prefix='providers')
        
        # Verificar si se ha seleccionado una imagen principal
        primary_image_id = request.POST.get('primary_image')
        
        if form.is_valid() and image_formset.is_valid() and supplier_formset.is_valid():
            # Guardar el producto
            product = form.save()
            
            # Guardar imágenes
            images = image_formset.save(commit=False)
            
            # Procesar las imágenes
            primary_set = False
            for image in images:
                image.product = product
                
                # Verificar si esta imagen debe ser la principal
                if primary_image_id and str(image.id) == primary_image_id:
                    image.is_primary = True
                    primary_set = True
                elif primary_image_id:
                    image.is_primary = False
                
                image.save()
            
            # Si no se ha establecido una imagen principal y hay imágenes, establecer la primera como principal
            if not primary_set and images:
                images[0].is_primary = True
                images[0].save()
            
            # Procesar eliminaciones de imágenes
            for obj in image_formset.deleted_objects:
                obj.delete()
            
            # Guardar proveedores
            suppliers = supplier_formset.save(commit=False)
            for supplier in suppliers:
                supplier.product = product
                supplier.save()
            
            # Procesar eliminaciones de proveedores
            for obj in supplier_formset.deleted_objects:
                obj.delete()
            
            messages.success(request, "Product updated successfully.")
            return redirect('adminuser:adminproducts')
        else:
            # Mostrar errores
            print("Form errors:", form.errors)
            print("Image formset errors:", image_formset.errors)
            print("Supplier formset errors:", supplier_formset.errors)
    else:
        form = ProductForm(instance=product)
        image_formset = ProductImageFormSet(instance=product, prefix='images')
        supplier_formset = ProductSupplierFormSet(instance=product, prefix='providers')
    
    # Obtener todos los proveedores activos
    suppliers = Supplier.objects.filter(active=True)
    
    return render(request, 'admin/editproduct.html', {
        'form': form,
        'image_formset': image_formset,
        'supplier_formset': supplier_formset,
        'product': product,
        'suppliers': suppliers,
    })

@admin_required
def delete_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    if request.method == 'POST':
        product.delete()
        messages.success(request, "Product deleted successfully.")
        return redirect('adminuser:adminproducts')
    return render(request, 'admin/confirm_delete_product.html', {'product': product})

@admin_required
def set_primary_image(request, product_id, image_id):
    if request.method == "POST":
        product = get_object_or_404(Product, id=product_id)
        image = get_object_or_404(ProductImage, id=image_id, product=product)

        # Desmarcar otras imágenes como principales
        ProductImage.objects.filter(product=product, is_primary=True).update(is_primary=False)

        # Marcar la nueva imagen como principal
        image.is_primary = True
        image.save()

        return JsonResponse({"success": True, "message": "Primary image updated successfully."})
    return JsonResponse({"success": False, "message": "Invalid request method."}, status=400)

@admin_required
def delete_image(request, image_id):
    if request.method == "POST":
        image = get_object_or_404(ProductImage, id=image_id)
        image.delete()
        return JsonResponse({"success": True, "message": "Image deleted successfully."})
    return JsonResponse({"success": False, "message": "Invalid request method."}, status=400)

from django.shortcuts import redirect, get_object_or_404
from shop.models import Order
from django.views.decorators.http import require_POST

@require_POST
def mark_as_delivered(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    order.status = 'delivered'  # Cambia el estado
    order.save()
    return redirect('adminuser:adminproducts')  # Redirección corregida

@require_POST
def delete_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    order.delete()
    return redirect('adminuser:adminproducts')  # Redirección corregida

def api_orders(request):
    """API endpoint to fetch all orders."""
    orders = Order.objects.all().order_by('-created_at')
    order_list = []
    for order in orders:
        order_list.append({
            'orderId': order.order_id,
            'customerName': order.customer_name,
            'date': order.created_at.isoformat(),
            'status': order.status,
            'total': float(order.total_amount),
            'items': [
                {
                    'productName': item.product.name,
                    'quantity': item.quantity,
                    'price': float(item.price),
                }
                for item in order.items.all()
            ],
        })
    return JsonResponse(order_list, safe=False)




