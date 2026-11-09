# Exportaciones de n8n: secretos redactados

Estos JSON son una copia de los workflows de n8n. **Los valores secretos están reemplazados por `<REDACTED>`**
(API key de YCloud, token de Chatwoot, claves viejas de validación). Por eso:

- No se pueden importar tal cual a n8n y esperar que funcionen sin volver a cargar esas claves.
- Antes de exportar de nuevo, hay que redactar los secretos y verificar que no queden (buscar `x-api-key`,
  `api_access_token`, `Bearer`, `sk-`, `eyJ`).
- Lo correcto es mover esas claves a **credenciales de n8n** (no dejarlas escritas en los nodos).

Las claves que estuvieron en texto plano ya figuran en el historial de git: **hay que rotarlas** (YCloud y Chatwoot).
