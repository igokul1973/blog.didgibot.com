FROM nginx:1.23.3-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ../dist/didgibot /var/www/app

WORKDIR /var/www/app
