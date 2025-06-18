from django import forms 
from adminuser.models import Supplier, Employee  # Importa correctamente desde adminuser.models
from shop.models import Category, Product , ProductImage , ProductSupplier # Solo importa Category desde shop.models
from django.core.exceptions import ValidationError
from django.forms import inlineformset_factory
 # Importa correctamente desde admin.models


# formulario para administradores
class AdminLoginForm(forms.Form):
    username = forms.CharField(label="Usuario")
    password = forms.CharField(widget=forms.PasswordInput, label="Contraseña")

class SupplierForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = ['name', 'dni', 'email', 'address']  # Solo los campos requeridos
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Name',
                'required': True,
            }),
            'dni': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter DNI',
                'required': True,
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Email',
                'required': True,
            }),
            'address': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Address',
                'required': True,
                'rows': 3,
            }),
        }
class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'background_image']
        widgets = {
            'name': forms.TextInput(attrs={
                'id': 'Category',
                'class': 'form-control',
                'placeholder': 'Enter category name',
                'required': True,
            }),
            'background_image': forms.ClearableFileInput(attrs={
                'id': 'CategoryImage',
                'class': 'form-control-file custom-file-input',
                'accept': 'image/*',
            }),
        }
class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['dni', 'first_name', 'last_name', 'phone_number', 'email', 'address']
        widgets = {
            'dni': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter DNI',
                'required': True,
            }),
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter First Name',
                'required': True,
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Last Name',
                'required': True,
            }),
            'phone_number': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Phone Number',
                'required': True,
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Email',
                'required': True,
            }),
            'address': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Address',
                'required': True,
                'rows': 3,
            }),
        }

    def clean_dni(self):
        dni = self.cleaned_data.get('dni')
        if not dni.isdigit():
            raise ValidationError("DNI must contain only numbers.")
        if len(dni) > 15:
            raise ValidationError("DNI cannot exceed 15 digits.")
        return dni

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if not phone_number.isdigit():
            raise ValidationError("Phone Number must contain only numbers.")
        if len(phone_number) < 7 or len(phone_number) > 11:
            raise ValidationError("Phone Number must be between 7 and 11 digits.")
        return phone_number

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        if any(char.isdigit() for char in first_name):
            raise ValidationError("First Name cannot contain numbers.")
        return first_name

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        if any(char.isdigit() for char in last_name):
            raise ValidationError("Last Name cannot contain numbers.")
        return last_name
    



class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description', 'category', 'weight','size', 'stock_per_box', 'available']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Product Name',
                'required': True,
            }),
            'stock_per_box': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Stock',
                'required': True,
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Product Description',
                'required': True,
                'rows': 3,
            }),
            'category': forms.Select(attrs={
                'class': 'form-control',
                'required': True,
            }),
            'weight': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Weight (kg)',
                'required': True,
            }),
              'size': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Size (Cm)',
                'required': True,
            }),
            'available': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
            }),
        }
class ProductImageForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ['image', 'is_primary']
        widgets = {
            'image': forms.ClearableFileInput(attrs={
                'class': 'form-control-file',
                'accept': 'image/*',
            }),
            'is_primary': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
            }),
        }
class ProductSupplierForm(forms.ModelForm):
    class Meta:
        model = ProductSupplier
        fields = ['supplier', 'price', 'currency', 'active']
        widgets = {
            'supplier': forms.Select(attrs={
                'class': 'form-control',
                'required': True,
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter Price',
                'required': True,
            }),
            'currency': forms.Select(attrs={
                'class': 'form-control',
                'required': True,
            }),
            'active': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
            }),
        }

ProductImageFormSet = inlineformset_factory(
    Product,
    ProductImage,
    form=ProductImageForm,
    extra=0,  # No se generarán formularios extra de forma visible
    can_delete=True
)

ProductSupplierFormSet = forms.inlineformset_factory(
    Product, 
    ProductSupplier,  # Asumiendo que este es tu modelo de relación
    form=ProductSupplierForm,
    extra=0,  # Cambia esto de 1 a 0 para que no añada formularios extra
    can_delete=True
)