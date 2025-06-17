from django.db import models
from django.urls import reverse
import qrcode
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image, ImageDraw
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.files.storage import FileSystemStorage
from django.conf import settings

fs = FileSystemStorage(location=settings.MEDIA_ROOT)

# Create your models here.
# Models Category
class Category(models.Model):
    name = models.CharField(max_length=200)

    """Slug es un atributo que se usa para la construccion
        de URL amigables para los usuarios"""
    slug = models.SlugField(max_length=200,
                            unique=True)

    """Las clases meta en Django aprotan optimizacion al
    filtrado y busqueda optimizada en las BD's"""
    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
        ]
        """Los atributos de tipo verbose ayudan en la gestion 
        de objetos en la administracion de la BD en Django"""
        verbose_name = 'category'
        verbose_name_plural = 'categories'

    # Lo siguiente retorna en la BD la representacion de String (name)    
    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('shop:product_list_by_category',
                       args=[self.slug])


class Product(models.Model):
    category = models.ForeignKey(Category,
                                 related_name='products',
                                 on_delete=models.CASCADE)

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    image = models.ImageField(upload_to='products/%Y/%m/%d',
                              blank=True, storage=fs)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10,
                                decimal_places=2)
    stock = models.IntegerField(default=0, verbose_name='Cantidad Existente')
    available = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['id', 'slug']),
            models.Index(fields=['name']),
            models.Index(fields=['-created']),            
        ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('shop:adminproduct_detail',
                       args=[self.id, self.slug])


    # Prototipo de generacion de QR
    qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True, storage=fs)


def generate_qr_code(product):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    url = f"https://corpoasia.ddns.net/shop/{product.id}/{product.slug}"  # Reemplaza con tu dominio
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    image_file = InMemoryUploadedFile(buffer, None, f'{product.name}_qr.png', 'image/png', buffer.getbuffer().nbytes, None)
    return image_file

@receiver(post_save, sender=Product)
def create_product_qr_code(sender, instance, created, **kwargs):
    if created:
        qr_image = generate_qr_code(instance)
        instance.qr_code.save(f'{instance.name}_qr.png', qr_image, save=False)





# from django.db import models
# from django.core.validators import MinValueValidator, MaxValueValidator
# from django.urls import reverse
# from django.utils.text import slugify
# from io import BytesIO
# from django.core.files.uploadedfile import InMemoryUploadedFile
# import qrcode
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.core.exceptions import ValidationError
# from django.conf import settings
# from adminuser.models import Supplier
# from django.db.models.signals import pre_save, post_save

# class Category(models.Model):
#     name = models.CharField(max_length=200, verbose_name="Name")
#     slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
#     background_image = models.ImageField(
#         upload_to='categories/backgrounds/',
#         verbose_name="Background image",
#         blank=True,
#         null=True,
#         help_text="Background image for the category"
#     )
    
#     class Meta:
#         ordering = ['name']
#         indexes = [
#             models.Index(fields=['name']),
#         ]
#         verbose_name = 'Category'
#         verbose_name_plural = 'Categories'
        
#     def __str__(self):
#         return self.name
    
#     def save(self, *args, **kwargs):
#         if not self.slug:
#             self.slug = slugify(self.name)
#         super().save(*args, **kwargs)
        
#     def get_absolute_url(self):
#         if not self.id or not self.slug:
#             return None
#         return reverse('shop:adminproduct_detail', args=[self.id, self.slug])

# class Product(models.Model):
#     category = models.ForeignKey(
#         'Category',
#         related_name='products',
#         on_delete=models.CASCADE
#     )
#     name = models.CharField(max_length=200)
#     slug = models.SlugField(max_length=200, blank=True, unique=True)
#     description = models.TextField()
#     size = models.CharField(max_length=50, help_text="Example: 10x20x5 cm")
#     weight = models.DecimalField(max_digits=6, decimal_places=2, help_text="Weight in kg")
#     stock_per_box = models.PositiveIntegerField(default=1)
#     rating = models.DecimalField(
#         max_digits=2, 
#         decimal_places=1,
#         validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
#         default=0.0
#     )
#     available = models.BooleanField(default=True)
#     created = models.DateTimeField(auto_now_add=True)
#     updated = models.DateTimeField(auto_now=True)
#     qr_code = models.ImageField(upload_to='qrcodes/', blank=True, null=True, verbose_name="QR Code")

#     suppliers = models.ManyToManyField(
#         'adminuser.Supplier',
#         through='ProductSupplier',
#         through_fields=('product', 'supplier'),
#         verbose_name="Suppliers"
#     )

#     class Meta:
#         ordering = ['name']
#         indexes = [
#             models.Index(fields=['id', 'slug']),
#             models.Index(fields=['name']),
#             models.Index(fields=['-created']),
#         ]

#     def __str__(self):
#         return self.name

#     def get_absolute_url(self):
#         if not self.id or not self.slug:
#             return None
#         try:
#             return reverse('shop:adminproduct_detail', args=[self.id, self.slug])
#         except:
#             return None

#     # def min_price(self):
#     #     return self.product_suppliers.order_by('price').first().price if self.product_suppliers.exists() else 0

#     # def max_price(self):
#     #     return self.product_suppliers.order_by('-price').first().price if self.product_suppliers.exists() else 0

#     def generate_qr_code(self):
#         """Genera y guarda el código QR para este producto"""
#         if not self.id or not self.slug:
#             return False
            
#         try:
#             if not settings.BASE_DOMAIN:
#                 raise ValueError("BASE_DOMAIN no está configurado en settings.py")
                
#             url = self.get_absolute_url()
#             if not url:
#                 return False
                
#             full_url = f"{settings.BASE_DOMAIN}{url}"
            
#             qr = qrcode.QRCode(
#                 version=1,
#                 error_correction=qrcode.constants.ERROR_CORRECT_L,
#                 box_size=10,
#                 border=4,
#             )
#             qr.add_data(full_url)
#             qr.make(fit=True)
            
#             img = qr.make_image(fill_color="black", back_color="white")
#             buffer = BytesIO()
#             img.save(buffer, format='PNG')
            
#             filename = f'product_{self.id}_qr.png'
#             file = InMemoryUploadedFile(
#                 buffer,
#                 None,
#                 filename,
#                 'image/png',
#                 buffer.getbuffer().nbytes,
#                 None
#             )
            
#             self.qr_code.save(filename, file, save=True)
#             return True
#         except Exception as e:
#             print(f"Error generando QR: {e}")
#             return False
#     def get_display_image(self):
#         """
#         Obtiene la imagen primaria (is_primary=True) o la primera imagen disponible.
#         Retorna None si no hay imágenes.
#         """
#         try:
#             # Primero intenta obtener la imagen marcada como primaria
#             primary_image = self.images.filter(is_primary=True).first()
#             if primary_image:
#                 return primary_image
            
#             # Si no hay primaria, obtiene la primera imagen disponible
#             return self.images.first()
#         except (AttributeError, ValueError):
#             return None

# @receiver(pre_save, sender=Product)
# def generate_product_slug(sender, instance, **kwargs):
#     """Genera el slug automáticamente antes de guardar si no existe"""
#     if not instance.slug:
#         original_slug = slugify(instance.name)
#         instance.slug = original_slug
        
#         # Verificar unicidad y añadir sufijo numérico si es necesario
#         counter = 1
#         while Product.objects.filter(slug=instance.slug).exclude(pk=instance.pk).exists():
#             instance.slug = f"{original_slug}-{counter}"
#             counter += 1

# @receiver(post_save, sender=Product)
# def update_product_qr_code(sender, instance, created, **kwargs):
#     """Genera/actualiza el QR después de guardar si es necesario"""
#     update_fields = kwargs.get('update_fields', set()) or set()
    
#     # Si no hay slug o fue actualizado, generarlo
#     if not instance.slug or 'name' in update_fields:
#         original_slug = slugify(instance.name)
#         instance.slug = original_slug
#         counter = 1
#         while Product.objects.filter(slug=instance.slug).exclude(pk=instance.pk).exists():
#             instance.slug = f"{original_slug}-{counter}"
#             counter += 1
#         instance.save(update_fields=['slug'])
    
#     # Generar QR code solo si el producto está completamente guardado
#     if (created or not instance.qr_code or 'slug' in update_fields or 'name' in update_fields) and instance.id:
#         instance.generate_qr_code()

# class ProductSupplier(models.Model):
#     CURRENCY_CHOICES = [
#         ('USD', 'US Dollars'),
#         ('MXN', 'Mexican Pesos'),
#         ('EUR', 'Euros'),
#     ]

#     product = models.ForeignKey(
#         Product,
#         on_delete=models.CASCADE,
#         related_name='product_suppliers'
#     )
#     supplier = models.ForeignKey(
#         'adminuser.Supplier',
#         on_delete=models.CASCADE,
#         related_name='supplier_products'
#     )
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     currency = models.CharField(max_length=3, default='USD', choices=CURRENCY_CHOICES)
#     last_updated = models.DateTimeField(auto_now=True)
#     active = models.BooleanField(default=True)

#     class Meta:
#         unique_together = ('product', 'supplier')
#         verbose_name = "Product-Supplier Relationship"
#         verbose_name_plural = "Product-Supplier Relationships"
#         ordering = ['product', 'price']

#     def __str__(self):
#         return f"{self.product} - {self.supplier}: {self.price} {self.currency}"

# class ProductImage(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
#     image = models.ImageField(upload_to='products/%Y/%m/%d/')
#     order = models.PositiveSmallIntegerField(default=0)
#     uploaded_at = models.DateTimeField(auto_now_add=True)
#     is_primary = models.BooleanField(default=False)

#     class Meta:
#         ordering = ['order']
#         constraints = [
#             models.UniqueConstraint(
#                 fields=['product', 'is_primary'],
#                 condition=models.Q(is_primary=True),
#                 name='unique_primary_image_per_product'
#             )
#         ]

#     def __str__(self):
#         return f"Image {self.id} for {self.product.name}"

#     def clean(self):
#         if not self.pk and ProductImage.objects.filter(product=self.product).count() >= 5:
#             raise ValidationError("Cannot add more than 5 images per product")

#     def save(self, *args, **kwargs):
#         if self.is_primary:
#             ProductImage.objects.filter(
#                 product=self.product, 
#                 is_primary=True
#             ).exclude(pk=self.pk).update(is_primary=False)
#         super().save(*args, **kwargs)