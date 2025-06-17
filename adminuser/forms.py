from django import forms
from . models import userProvider

class UserProviderForm(forms.ModelForm):
    class Meta:
        model = userProvider
        fields = [
            'DNI',
            'RIF',
            'Name',
            'Last_Name',
            'Country',
            'Email',
            'Phone_Number',
            'Address',
            'User',
            'Password',
            'Role',
        ]
