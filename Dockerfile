FROM php:8.2


RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql


WORKDIR /var/www/html


COPY . .


RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Lancement de l'application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
