from django import forms
from . models import UserClient

class UserForm(forms.ModelForm):
    class Meta:
        model = UserClient
        fields = [
            'DNI',
            'Name',
            'Last_Name',
            'Country',
            'Email',
            'Phone_Number',
            'Postal',
            'Address',
            'User',
            'Password',
        ]
