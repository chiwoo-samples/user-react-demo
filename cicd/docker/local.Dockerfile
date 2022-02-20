FROM nginx

WORKDIR /app

RUN mkdir ./build

ADD ./build ./build

RUN rm /etc/nginx/conf.d/default.conf

COPY ./cicd/nginx/nginx-local.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80