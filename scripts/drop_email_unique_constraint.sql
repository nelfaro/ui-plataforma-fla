-- Eliminar constraint UNIQUE en email
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS alumnos_email_key;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_email_key;
