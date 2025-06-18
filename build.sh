#!/bin/bash
# Script refreshed on 2025-06-18 17:07:51 UTC
# Exit on error
set -o errexit

# Install dependencies first
echo "Installing dependencies..."
pip install -r requirements.txt

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate auth
python manage.py migrate contenttypes
python manage.py migrate sessions

# Project specific apps - ensure this order is correct for your app dependencies
python manage.py migrate adminuser # adminuser might have users, good to have it early if other apps depend on its models
python manage.py migrate shop
python manage.py migrate cart
python manage.py migrate home

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Attempt to create superuser
echo "Attempting to create superuser 'admin'..."
cat <<EOF | python manage.py shell
from django.contrib.auth import get_user_model

User = get_user_model()

username = 'admin'
password = 'admin'
email = 'admin@example.com'

if not User.objects.filter(username=username).exists():
    User.create_superuser(username, email, password)
    print(f"Superuser '{username}' created.")
else:
    print(f"Superuser '{username}' already exists. Skipping creation.")
EOF
echo "Superuser creation attempt finished."