FROM nginx:1.23.3-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ../dist/manhattanman /var/www/app

WORKDIR /var/www/app
