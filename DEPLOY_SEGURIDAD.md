# Puesta en producción del login real (gateway)

Cambio de arquitectura: el contenedor del frontend ahora corre un servidor Node (`backend-proxy/server.js`)
que sirve la UI, valida el login (cookie HttpOnly firmada) y reenvía a n8n **solo** los webhooks permitidos,
agregando la clave secreta `x-api-key` desde el servidor. nginx ya no se usa.

## Orden (sin cortes de servicio)
1. **EasyPanel → servicio de gestionfla → Entorno**: cargar `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD`,
   `N8N_BASE_URL`, `N8N_API_KEY` (ver `backend-proxy/.env.example`). Si falta alguna, el contenedor no arranca (a propósito).
2. **n8n → Credentials → New → Header Auth**: Name `Fla API Key`, Header name `x-api-key`, Value = el mismo `N8N_API_KEY`.
3. Mergear esta rama a `main` (GitHub Actions + EasyPanel despliegan solo). Verificar login en la UI.
4. Recién ahí se activa la autenticación Header Auth en los webhooks de n8n que usa la UI (se hace por MCP/UI).
5. Verificación: `curl https://gestionfla.escalia.com.ar/api/webhook/get-leads-list` -> 401, y
   `curl https://<n8n>/webhook/get-leads-list` -> 403.

## Pendiente fuera de la lista blanca (siguen abiertos en n8n)
`whatsapp-entrada`, `create-lead`, `save-conversation-log`, `registrar-derivacion-a-fla`, `obtener-*`, `get-conversation-logs`.
Los llaman WhatsApp/Chatwoot/agente: protegerlos requiere coordinar con esos emisores.
