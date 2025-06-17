from django.contrib import admin
from .models import Category, Product

# Register your models here.

# models Category
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = { 'slug': ('name', )}
    
@admin.register(Product)
class PrductAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price', 'stock',
                    'available', 'created', 'updated', 'qr_code']
    list_filter = ['available', 'created', 'updated']
    list_editable = ['price', 'available']
    prepopulated_fields = {'slug': ('name',)}



# from django.contrib import admin
# from django.utils.safestring import mark_safe
# from .models import Category, Product 
# # ProductSupplier, ProductImage

# @admin.register(Category)
# class CategoryAdmin(admin.ModelAdmin):
#     list_display = ['name', 'slug', 'background_preview']
#     prepopulated_fields = {'slug': ('name',)}
#     readonly_fields = ['background_preview']
    
#     def background_preview(self, obj):
#         if obj.background_image:
#             return mark_safe(f'<img src="{obj.background_image.url}" width="200" style="border: 1px solid #ddd; border-radius: 4px; padding: 5px;" />')
#         return "No Image available"
    
#     background_preview.short_description = "Preview"

# @admin.register(Product)
# class ProductAdmin(admin.ModelAdmin):
#     list_display = ('name', 'category', 'available', 'main_image_preview', 'min_price', 'max_price', 'qr_preview', 'product_link')
#     readonly_fields = ('main_image_preview', 'min_price', 'max_price', 'qr_preview', 'product_link')
    
#     def main_image_preview(self, obj):
#         display_image = obj.get_display_image() if hasattr(obj, 'get_display_image') else None
#         if display_image and display_image.image:
#             return mark_safe(f'<img src="{display_image.image.url}" width="100" />')
#         return "No main image"
#     main_image_preview.short_description = 'Main Image'
    
    
    
    # def min_price(self, obj):
    #     return f"${obj.min_price():.2f}" if hasattr(obj, 'min_price') else "N/A"
    # min_price.short_description = 'Min Price'
    
    # def max_price(self, obj):
    #     return f"${obj.max_price():.2f}" if hasattr(obj, 'max_price') else "N/A"
    # max_price.short_description = 'Max Price'
    
    # def qr_preview(self, obj):
    #     if obj.qr_code:
    #         return mark_safe(f'<img src="{obj.qr_code.url}" width="100" />')
    #     return "No QR Code"
    # qr_preview.short_description = 'QR Code'
    
    # def product_link(self, obj):
    #     if hasattr(obj, 'get_absolute_url'):
    #         url = obj.get_absolute_url()
    #         if url:
    #             return mark_safe(f'<a href="{url}" target="_blank">View</a>')
    #     return "No URL"
    # product_link.short_description = 'Link'

    
# @admin.register(ProductSupplier)
# class ProductSupplierAdmin(admin.ModelAdmin):
#     list_display = ('product', 'supplier', 'price', 'currency', 'active')
#     list_editable = ('price', 'currency', 'active')
#     list_filter = ('currency', 'active', 'supplier')
#     search_fields = ('product__name', 'supplier__name')

# @admin.register(ProductImage)
# class ProductImageAdmin(admin.ModelAdmin):
#     list_display = ('product', 'image_preview', 'is_primary', 'uploaded_at')
#     list_editable = ('is_primary',)
#     readonly_fields = ('image_preview',)
    
#     def image_preview(self, obj):
#         if obj.image:
#             return mark_safe(f'<img src="{obj.image.url}" width="100" style="border: 1px solid #ddd; border-radius: 4px; padding: 2px;" />')
#         return "No Image"
#     image_preview.short_description = 'Preview'