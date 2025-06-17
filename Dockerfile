FROM python:3.9

ENV PYTHONUNBUFFERED=1

RUN mkdir /china-prototipo

# Se crea y establece la carpeta del proyecto
WORKDIR /china-prototipo

COPY media /china-prototipo/media
RUN chmod -R 755 /china-prototipo/media

# Copiamos lo requerimientos a ser instalados
COPY requirements.txt /china-prototipo/

# Actualización del SO y sus dependiencias
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# Se instalan los requerimientos
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

# Se copia el código fuente
COPY . /china-prototipo

# # Se erjecuta el servidor en el puerto 8000
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]