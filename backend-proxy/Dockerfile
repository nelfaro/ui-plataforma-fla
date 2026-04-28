FROM node:20-alpine

WORKDIR /app

COPY backend-proxy/package*.json ./
RUN npm ci --omit=dev

COPY backend-proxy/server.js ./

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
