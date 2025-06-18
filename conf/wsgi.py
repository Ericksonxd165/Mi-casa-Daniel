"""
WSGI config for conf project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

# Establece la variable de entorno para el archivo de configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conf.settings')

# Aplica la configuración y crea la aplicación WSGI
application = get_wsgi_application()
