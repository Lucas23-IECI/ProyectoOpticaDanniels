# Etapa 1: Build
FROM node:18 AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Argument para la URL base
ARG VITE_BASE_URL=http://OpticaDanniels.com:3000/api
ENV VITE_BASE_URL=$VITE_BASE_URL

# Build para producción
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiar archivos built
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
