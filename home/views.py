from . forms import UserForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from home.models import UserClient  # Importa el modelo de usuarios normales
from shop.models import Product
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import traceback

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
import base64
import os
from django.conf import settings
from shop.models import Product, ProductSupplier, Order, OrderItem, Invoice
from django.db.models import Q






def product_detail(request, id, slug):
        product = get_object_or_404(Product, id=id, slug=slug, available=True)
        return render(request, 'shop/product_detail.html', {'product': product})

def cart_view(request):
        return render(request, 'shop/cart.html')

def get_product_json(request, product_id):
        """API endpoint to get product details in JSON format"""
        try:
            product = Product.objects.get(id=product_id, available=True)
            
            # Get the main image URL
            main_image = product.get_display_image()
            image_url = main_image.image.url if main_image else ""
            
            # Get all suppliers for this product
            suppliers = []
            for ps in product.product_suppliers.all():
                suppliers.append({
                    'id': ps.supplier.id,
                    'name': ps.supplier.name,
                    'price': float(ps.price),
                    'currency': ps.currency
                })
            
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'image': image_url,
                'suppliers': suppliers
            }
            
            return JsonResponse(product_data)
        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)

def checkout_view(request):
        """View for the checkout page"""
        return render(request, 'checkout.html')

@csrf_exempt
def save_order(request):
    """API endpoint to save an order to the database"""
    try:
        data = json.loads(request.body)
        print("Received order data:", data)  # Debug print
        
        # Check if order already exists
        existing_order = Order.objects.filter(order_id=data.get('orderId')).first()
        if existing_order:
            # Update existing order
            existing_order.customer_name = data.get('customerName')
            existing_order.customer_email = data.get('customerEmail')
            existing_order.customer_phone = data.get('customerPhone')
            existing_order.customer_id = data.get('customerId')
            existing_order.shipping_address = data.get('address')
            existing_order.shipping_city = data.get('city')
            existing_order.shipping_province = data.get('province')
            existing_order.shipping_country = data.get('country')
            existing_order.shipping_postal_code = data.get('postalCode')
            existing_order.payment_method = data.get('paymentMethod')
            existing_order.total_amount = data.get('total')
            existing_order.save()
            
            # Delete existing order items
            existing_order.items.all().delete()
            
            # Create new order items
            for item_data in data.get('items', []):
                try:
                    product = get_object_or_404(Product, id=item_data.get('id'))
                    supplier_id = item_data.get('supplier', {}).get('id')
                    
                    OrderItem.objects.create(
                        order=existing_order,
                        product=product,
                        supplier_id=supplier_id,
                        price=item_data.get('price'),
                        quantity=item_data.get('quantity'),
                        invoice_id=item_data.get('invoiceId')
                    )
                except Exception as e:
                    print(f"Error creating order item: {str(e)}")
                    continue
            
            print(f"Order updated successfully: {existing_order.order_id}")
            return JsonResponse({'status': 'success', 'orderId': existing_order.order_id})
        else:
            # Create new order
            order = Order.objects.create(
                order_id=data.get('orderId'),
                customer_name=data.get('customerName'),
                customer_email=data.get('customerEmail'),
                customer_phone=data.get('customerPhone'),
                customer_id=data.get('customerId'),
                shipping_address=data.get('address'),
                shipping_city=data.get('city'),
                shipping_province=data.get('province'),
                shipping_country=data.get('country'),
                shipping_postal_code=data.get('postalCode'),
                payment_method=data.get('paymentMethod'),
                total_amount=data.get('total'),
                status='pending'
            )
            
            # Create order items
            for item_data in data.get('items', []):
                try:
                    product = get_object_or_404(Product, id=item_data.get('id'))
                    supplier_id = item_data.get('supplier', {}).get('id')
                    
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        supplier_id=supplier_id,
                        price=item_data.get('price'),
                        quantity=item_data.get('quantity'),
                        invoice_id=item_data.get('invoiceId')
                    )
                except Exception as e:
                    print(f"Error creating order item: {str(e)}")
                    continue
            
            print(f"Order created successfully: {order.order_id}")
            return JsonResponse({'status': 'success', 'orderId': order.order_id})
    
    except Exception as e:
        print(f"Error saving order: {str(e)}")
        traceback.print_exc()  # Print full traceback for debugging
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
@require_POST
def save_invoice(request):
        """API endpoint to save an invoice PDF"""
        try:
            data = json.loads(request.body)
            
            for invoice_data in data.get('facturas', []):
                invoice_id = invoice_data.get('invoice_id')
                pdf_base64 = invoice_data.get('pdf_base64')
                
                # Find the order with this invoice ID
                order = get_object_or_404(Order, order_id=invoice_id.split('-')[0])
                
                # Convert base64 to file and save
                if pdf_base64 and pdf_base64.startswith('data:application/pdf;base64,'):
                    pdf_data = pdf_base64.replace('data:application/pdf;base64,', '')
                    pdf_bytes = base64.b64decode(pdf_data)
                    
                    # Create directory if it doesn't exist
                    invoice_dir = os.path.join(settings.MEDIA_ROOT, 'invoices')
                    os.makedirs(invoice_dir, exist_ok=True)
                    
                    # Save file
                    filename = f"invoice_{invoice_id}.pdf"
                    filepath = os.path.join(invoice_dir, filename)
                    
                    with open(filepath, 'wb') as f:
                        f.write(pdf_bytes)
                    
                    # Create or update invoice record
                    invoice, created = Invoice.objects.update_or_create(
                        invoice_id=invoice_id,
                        defaults={
                            'order': order,
                            'pdf_file': f'invoices/{filename}'
                        }
                    )
            
            return JsonResponse({'status': 'ok'})
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def order_history(request):
    """View for the order history page"""
    current_user_email = request.session.get('user_email')  # Use session to identify the user
    if not current_user_email:
        return JsonResponse({'error': 'User not authenticated'}, status=401)

    orders = Order.objects.filter(customer_email=current_user_email).order_by('-created_at')
    return render(request, 'order_history.html', {'orders': orders})

def order_detail(request, order_id):
        """View for a specific order's details"""
        # In a real app, you would fetch the specific order
        # For now, we'll just render the template
        return render(request, 'order_detail.html', {'order_id': order_id})

def checkout_view(request):
    # Aquí puedes agregar cualquier lógica que necesites, como la creación de un pedido
    return render(request, 'checkout.html')



def home(request):
    products = Product.objects.filter(available=True)
    return render(request, 'home.html', {'products': products})


def profile(request):
    return render(request, 'profile.html')


def carrito(request):
    return render(request, 'carrito.html')

def index(request):
    return render(request, 'index.html')

def login(request):
    return render(request, 'login.html')

def scanner(request):
    return render(request, 'scanner.html')

def catalogo(request):
    return render(request, 'catalogo.html')

def product(request):
    return render(request, 'producto.html') 

def api_orders(request):
    """API endpoint to fetch orders."""
    email = request.GET.get('email')
    if email:
        # Filtrar órdenes por el email del cliente
        orders = Order.objects.filter(customer_email=email).order_by('-created_at')
    else:
        # Retornar un error si no se proporciona el email
        return JsonResponse({'error': 'Email parameter is required.'}, status=400)

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

# home/views.py





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