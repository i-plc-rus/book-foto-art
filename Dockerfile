# 1. Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production

# 2. Production stage — nginx
FROM nginx:alpine

COPY --from=build /app/dist/book-foto-art /usr/share/nginx/html


# Копируем кастомный конфиг nginx (если нужно)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
