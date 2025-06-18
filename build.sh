#!/bin/bash
# Exit on error
set -o errexit

echo "Applying database migrations..."
python manage.py migrate auth
python manage.py migrate contenttypes
python manage.py migrate sessions # sessions often comes early too
# Add other django.contrib apps if they have migrations and are used by your apps directly in migrations
# python manage.py migrate admin 

# Project specific apps
python manage.py migrate shop
python manage.py migrate cart

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
