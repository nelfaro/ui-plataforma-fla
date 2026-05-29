-- Eliminar constraint UNIQUE en whatsapp
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS alumnos_whatsapp_key;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_whatsapp_key;
