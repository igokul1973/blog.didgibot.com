FROM nginx:1.28-alpine3.21

COPY ./cicd/nginx.conf /etc/nginx/nginx.conf
COPY ./dist/dgb-blog/browser/ /var/www/app/

WORKDIR /var/www/app
