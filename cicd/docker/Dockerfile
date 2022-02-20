# FROM nginx:alpine
FROM nginx

WORKDIR /app

RUN mkdir ./build

ADD ./build ./build

RUN rm /etc/nginx/conf.d/default.conf

COPY ./cicd/nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80