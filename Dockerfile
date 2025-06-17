# Usa la imagen oficial de Python 3.9 como base
FROM python:3.9

# Crea el directorio de trabajo en el contenedor
RUN mkdir /china-prototipo
WORKDIR /china-prototipo

# Crear un usuario no root
RUN useradd -m myuser
USER myuser

# Copia el archivo de requerimientos a instalar
COPY requirements.txt /china-prototipo/

# Actualiza el sistema e instala dependencias necesarias
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# Instala los requerimientos de Python
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

# Copia todo el código fuente al contenedor
COPY . /china-prototipo/

# Copia los archivos de media
COPY media /china-prototipo/media
RUN chmod -R 755 /china-prototipo/media

# Exponer el puerto 8000
EXPOSE 8000

# Usa Gunicorn para ejecutar la aplicación en producción (reemplaza `runserver`)
CMD ["gunicorn", "conf.wsgi:application", "--bind", "0.0.0.0:8000"]
