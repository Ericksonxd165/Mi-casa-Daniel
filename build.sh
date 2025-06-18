#!/bin/bash
# Script refreshed on 2025-06-18 17:07:51 UTC
# Exit on error
set -o errexit

# Install dependencies first
echo "Installing dependencies..."
pip install -r requirements.txt

# Apply database migrations
echo "Applying database migrations..."
echo "Migrating core Django apps..."
python manage.py migrate auth
python manage.py migrate contenttypes
python manage.py migrate sessions
python manage.py migrate admin # Django admin app

echo "Migrating project apps..."
python manage.py migrate # General migrate for all other apps

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