FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit

COPY . .

# Declarar build args para que Vite los reciba durante el build
ARG VITE_API_BASE_URL=/api
ARG VITE_CUSTOMER_NAME
ARG VITE_CUSTOMER_PRIMARY_COLOR
ARG VITE_CUSTOMER_SECONDARY_COLOR
ARG VITE_CHATWOOT_URL
ARG VITE_WHATSAPP_URL
ARG VITE_API_TIMEOUT=30000
ARG VITE_DEBUG_MODE=false

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CUSTOMER_NAME=$VITE_CUSTOMER_NAME
ENV VITE_CUSTOMER_PRIMARY_COLOR=$VITE_CUSTOMER_PRIMARY_COLOR
ENV VITE_CUSTOMER_SECONDARY_COLOR=$VITE_CUSTOMER_SECONDARY_COLOR
ENV VITE_CHATWOOT_URL=$VITE_CHATWOOT_URL
ENV VITE_WHATSAPP_URL=$VITE_WHATSAPP_URL
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ENV VITE_DEBUG_MODE=$VITE_DEBUG_MODE

RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
