from django.shortcuts import render, get_object_or_404
from .models import Category, Product, ProductImage, Product, ProductSupplier
from cart.forms import CartAddProductForm
from django.db.models import Prefetch, Q
from django.http import JsonResponse
import json
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
import base64
import os
from django.conf import settings
from .models import Product, ProductSupplier, Order, OrderItem, Invoice
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
import base64
import os
from django.conf import settings
from .models import Product, ProductSupplier, Order, OrderItem, Invoice

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
import base64
import os
import traceback
from django.conf import settings
from .models import Product, ProductSupplier, Order, OrderItem, Invoice

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
    except Exception as e:
        print(f"Error in get_product_json: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

def checkout_view(request):
    """View for the checkout page"""
    return render(request, 'checkout.html')

@csrf_exempt
def save_order(request):
    """API endpoint to save an order to the database"""
    try:
        # Imprimir información de depuración
        print("Request method:", request.method)
        print("Request headers:", request.headers)
        
        # Verificar si hay datos en el cuerpo de la solicitud
        if not request.body:
            return JsonResponse({'status': 'error', 'message': 'No request body provided'}, status=400)
        
        # Intentar parsear el JSON
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            return JsonResponse({'status': 'error', 'message': f'Invalid JSON: {str(e)}'}, status=400)
        
        print("Received order data:", data)  # Debug print
        
        # Validar campos requeridos
        required_fields = ['orderId', 'customerName', 'items']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return JsonResponse({
                'status': 'error', 
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=400)
        
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
                    product_id = item_data.get('id')
                    if not product_id:
                        print(f"Missing product ID in item data: {item_data}")
                        continue
                        
                    product = Product.objects.get(id=product_id)
                    
                    # Obtener el ID del proveedor
                    supplier_data = item_data.get('supplier', {})
                    supplier_id = supplier_data.get('id')
                    
                    if not supplier_id:
                        print(f"Missing supplier ID in item data: {item_data}")
                        continue
                    
                    # Importar el modelo Supplier desde adminuser
                    from adminuser.models import Supplier
                    
                    # Verificar si el proveedor existe
                    try:
                        supplier = Supplier.objects.get(id=supplier_id)
                    except Supplier.DoesNotExist:
                        print(f"Supplier with ID {supplier_id} does not exist")
                        # Si no existe, crear un proveedor temporal para pruebas
                        supplier = Supplier.objects.first()
                        if not supplier:
                            print("No suppliers found in database, cannot create order item")
                            continue
                    
                    # Crear el item de la orden
                    OrderItem.objects.create(
                        order=existing_order,
                        product=product,
                        supplier=supplier,
                        price=item_data.get('price', 0),
                        quantity=item_data.get('quantity', 1),
                        invoice_id=item_data.get('invoiceId', '')
                    )
                except Exception as e:
                    print(f"Error creating order item: {str(e)}")
                    traceback.print_exc()
                    continue
            
            print(f"Order updated successfully: {existing_order.order_id}")
            return JsonResponse({'status': 'success', 'orderId': existing_order.order_id})
        else:
            # Create new order
            order = Order.objects.create(
                order_id=data.get('orderId'),
                customer_name=data.get('customerName'),
                customer_email=data.get('customerEmail', ''),
                customer_phone=data.get('customerPhone', ''),
                customer_id=data.get('customerId', ''),
                shipping_address=data.get('address', ''),
                shipping_city=data.get('city', ''),
                shipping_province=data.get('province', ''),
                shipping_country=data.get('country', ''),
                shipping_postal_code=data.get('postalCode', ''),
                payment_method=data.get('paymentMethod', ''),
                total_amount=data.get('total', 0),
                status='pending'
            )
            
            # Create order items
            for item_data in data.get('items', []):
                try:
                    product_id = item_data.get('id')
                    if not product_id:
                        print(f"Missing product ID in item data: {item_data}")
                        continue
                        
                    product = Product.objects.get(id=product_id)
                    
                    # Obtener el ID del proveedor
                    supplier_data = item_data.get('supplier', {})
                    supplier_id = supplier_data.get('id')
                    
                    if not supplier_id:
                        print(f"Missing supplier ID in item data: {item_data}")
                        continue
                    
                    # Importar el modelo Supplier desde adminuser
                    from adminuser.models import Supplier
                    
                    # Verificar si el proveedor existe
                    try:
                        supplier = Supplier.objects.get(id=supplier_id)
                    except Supplier.DoesNotExist:
                        print(f"Supplier with ID {supplier_id} does not exist")
                        # Si no existe, crear un proveedor temporal para pruebas
                        supplier = Supplier.objects.first()
                        if not supplier:
                            print("No suppliers found in database, cannot create order item")
                            continue
                    
                    # Crear el item de la orden
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        supplier=supplier,
                        price=item_data.get('price', 0),
                        quantity=item_data.get('quantity', 1),
                        invoice_id=item_data.get('invoiceId', '')
                    )
                except Exception as e:
                    print(f"Error creating order item: {str(e)}")
                    traceback.print_exc()
                    continue
            
            print(f"Order created successfully: {order.order_id}")
            return JsonResponse({'status': 'success', 'orderId': order.order_id})
    
    except Exception as e:
        print(f"Error saving order: {str(e)}")
        traceback.print_exc()  # Print full traceback for debugging
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@require_POST
def save_invoice(request):
    """API endpoint to save an invoice PDF"""
    try:
        data = json.loads(request.body)
        
        for invoice_data in data.get('facturas', []):
            invoice_id = invoice_data.get('invoice_id')
            pdf_base64 = invoice_data.get('pdf_base64')
            
            # Find the order with this invoice ID
            order_id = invoice_id.split('-')[0] if '-' in invoice_id else invoice_id
            order = get_object_or_404(Order, order_id=order_id)
            
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
        print(f"Error saving invoice: {str(e)}")
        traceback.print_exc()  # Print full traceback for debugging
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def get_orders(request):
    """API endpoint to get all orders"""
    try:
        # In a real app, you would filter by user
        # For now, we'll just return all orders
        orders = Order.objects.all().order_by('-created_at')
        
        orders_data = []
        for order in orders:
            # Get order items
            items = []
            for item in order.items.all():
                try:
                    items.append({
                        'id': item.product.id,
                        'title': item.product.name,
                        'price': float(item.price),
                        'quantity': item.quantity,
                        'supplier': {
                            'id': item.supplier.id,
                            'name': item.supplier.name
                        }
                    })
                except Exception as e:
                    print(f"Error processing order item: {str(e)}")
                    continue
            
            # Add order to list
            orders_data.append({
                'orderId': order.order_id,
                'status': order.status,
                'total': float(order.total_amount),
                'created_at': order.created_at.isoformat(),
                'items': items
            })
        
        return JsonResponse({'orders': orders_data})
    
    except Exception as e:
        print(f"Error getting orders: {str(e)}")
        traceback.print_exc()  # Print full traceback for debugging
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
# Modificamos la vista get_order para que maneje correctamente la obtención de órdenes
def get_order(request, order_id):
    """API endpoint to get a specific order"""
    try:
        print(f"Fetching order with ID: {order_id}")
        order = get_object_or_404(Order, order_id=order_id)
        
        # Get order items
        items = []
        for item in order.items.all():
            try:
                # Obtener la imagen del producto si existe
                product_image = item.product.get_display_image()
                image_url = product_image.image.url if product_image else "/static/images/placeholder.png"
                
                items.append({
                    'id': item.product.id,
                    'title': item.product.name,
                    'price': float(item.price),
                    'quantity': item.quantity,
                    'image': image_url,
                    'supplier': {
                        'id': item.supplier.id,
                        'name': item.supplier.name
                    }
                })
            except Exception as e:
                print(f"Error processing order item: {str(e)}")
                continue
        
        # Create order data
        order_data = {
            'order_id': order.order_id,
            'customer_name': order.customer_name,
            'customer_email': order.customer_email,
            'customer_phone': order.customer_phone,
            'customer_id': order.customer_id,
            'shipping_address': order.shipping_address,
            'shipping_city': order.shipping_city,
            'shipping_province': order.shipping_province,
            'shipping_country': order.shipping_country,
            'shipping_postal_code': order.shipping_postal_code,
            'payment_method': order.payment_method,
            'total_amount': float(order.total_amount),
            'status': order.status,
            'created_at': order.created_at.isoformat(),
            'items': items
        }
        
        return JsonResponse(order_data)
    
    except Order.DoesNotExist:
        print(f"Order not found: {order_id}")
        return JsonResponse({'status': 'error', 'message': 'Order not found'}, status=404)
    except Exception as e:
        print(f"Error getting order: {str(e)}")
        traceback.print_exc()  # Print full traceback for debugging
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def get_invoice(request, order_id):
    """API endpoint to get an invoice PDF"""
    try:
        # Find the invoice for this order
        invoice = Invoice.objects.filter(order__order_id=order_id).first()
        if not invoice:
            return JsonResponse({'status': 'error', 'message': 'Invoice not found'}, status=404)
        
        # Check if file exists
        file_path = os.path.join(settings.MEDIA_ROOT, invoice.pdf_file.name)
        if not os.path.exists(file_path):
            return JsonResponse({'status': 'error', 'message': 'Invoice file not found'}, status=404)
        
        # Return the file
        response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Invoice-{invoice.invoice_id}.pdf"'
        return response
    
    except Exception as e:
        print(f"Error getting invoice: {str(e)}")
        traceback.print_exc()  # Print full traceback for debugging
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def order_history(request):
    """View for the order history page"""
    return render(request, 'order_history.html')

def order_detail(request, order_id):
    """View for a specific order's details"""
    return render(request, 'order_detail.html', {'order_id': order_id})

def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)

    # Search functionality
    query = request.GET.get('q')
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)

    # Pagination logic
    paginator = Paginator(products, 16)  # Show 16 products per page
    page = request.GET.get('page', 1)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    return render(request, 'shop/product/products_list.html', {
        'category': category,
        'categories': categories,
        'products': products,
        'paginator': paginator,
        'page_obj': products,  # For compatibility with Django's pagination template tags
        'query': query,  # Pass the search query to the template
    })

def adminproduct_detail(request, id, slug):
    product = get_object_or_404(Product,
                                id=id,
                                slug=slug,
                                available=True)
    cart_product_form = CartAddProductForm()
    return render(request, 
                  'shop/product/adminproduct_detail.html',                                
                  {'product': product,
                  'cart_product_form': cart_product_form})

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

@require_POST
def save_order(request):
    """API endpoint to save an order to the database"""
    try:
        data = json.loads(request.body)
        
        # Create the order
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
        
        return JsonResponse({'status': 'success', 'orderId': order.order_id})
    
    except Exception as e:
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
    # In a real app, you would fetch orders for the logged-in user
    # For now, we'll just render the template
    return render(request, 'order_history.html')

def order_detail(request, order_id):
    """View for a specific order's details"""
    # In a real app, you would fetch the specific order
    # For now, we'll just render the template
    return render(request, 'order_detail.html', {'order_id': order_id})

def search_suggestions(request):
    """API endpoint to get search suggestions."""
    query = request.GET.get('q', '')
    if query:
        suggestions = Product.objects.filter(name__icontains=query).values_list('name', flat=True)[:5]
        return JsonResponse({'suggestions': list(suggestions)})
    return JsonResponse({'suggestions': []})
