# ---- Etapa 1: build del frontend ----
FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .

# Variables públicas (se incrustan en el bundle: NUNCA poner secretos acá)
ARG VITE_CUSTOMER_NAME
ARG VITE_CUSTOMER_PRIMARY_COLOR
ARG VITE_CUSTOMER_SECONDARY_COLOR
ARG VITE_CHATWOOT_URL
ARG VITE_WHATSAPP_URL
ARG VITE_API_TIMEOUT=30000
ARG VITE_DEBUG_MODE=false
ENV VITE_CUSTOMER_NAME=$VITE_CUSTOMER_NAME \
    VITE_CUSTOMER_PRIMARY_COLOR=$VITE_CUSTOMER_PRIMARY_COLOR \
    VITE_CUSTOMER_SECONDARY_COLOR=$VITE_CUSTOMER_SECONDARY_COLOR \
    VITE_CHATWOOT_URL=$VITE_CHATWOOT_URL \
    VITE_WHATSAPP_URL=$VITE_WHATSAPP_URL \
    VITE_API_TIMEOUT=$VITE_API_TIMEOUT \
    VITE_DEBUG_MODE=$VITE_DEBUG_MODE

RUN npm run build

# ---- Etapa 2: gateway (sirve el frontend + login + proxy a n8n) ----
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production PORT=80

COPY backend-proxy/package.json backend-proxy/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY backend-proxy/server.js ./
COPY --from=builder /app/dist ./public

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||80)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
