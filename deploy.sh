#!/bin/bash
# Este es el script de despliegue para Render
pip install -r requirements.txt
# Ejecuta las migraciones de la base de datos
python manage.py makemigrations adminuser
python manage.py makemigrations cart
python manage.py makemigrations home
python manage.py makemigrations shop


python manage.py migrate adminuser
python manage.py migrate cart
python manage.py migrate home
python manage.py migrate shop
# Recoge los archivos estáticos
python manage.py collectstatic --noinput

# Otros comandos que puedas necesitar para tu despliegue
