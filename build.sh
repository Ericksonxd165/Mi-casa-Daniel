#!/bin/bash
# Exit on error
set -o errexit

pip install -r requirements.txt

python manage.py makemigrations adminuser
python manage.py makemigration cart
python manage.py makemigrations home
python manage.py makemigrations orders
python manage.py makemigrations shop


python manage.py migrate adminuser
python manage.py migrate cart
python manage.py migrate home
python manage.py migrate orders
python manage.py migrate shop


# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput
