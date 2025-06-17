# Usa la imagen oficial de Python 3.9 como base
FROM python:3.9

# Establece una variable de entorno para evitar que Python genere archivos pyc
ENV PYTHONUNBUFFERED 1

# Crea el directorio de trabajo en el contenedor
RUN mkdir /china-prototipo
WORKDIR /china-prototipo

# Actualiza el sistema e instala dependencias necesarias para compilación de algunas bibliotecas
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# Instala los requerimientos de Python
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

# Crea un usuario no root para ejecutar la aplicación (esto es opcional pero recomendado por razones de seguridad)
RUN useradd -m myuser
USER myuser

# Copia todo el código fuente al contenedor
COPY . /china-prototipo/

# Copia los archivos de media
COPY media /china-prototipo/media
RUN chmod -R 755 /china-prototipo/media

# Exponer el puerto 8000
EXPOSE 8000

# Usa Gunicorn para ejecutar la aplicación en producción (reemplaza `runserver`)
CMD ["gunicorn", "conf.wsgi:application", "--bind", "0.0.0.0:8000"]
