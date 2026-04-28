FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --no-audit

# Copiar código
COPY . .

# Build con Vite
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

# Copiar build a nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
