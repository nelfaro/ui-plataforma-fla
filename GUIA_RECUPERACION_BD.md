# 🔧 Guía de Recuperación - Base de Datos FLA

## 🚨 Situación Actual
- Base de datos PostgreSQL: **ELIMINADA**
- Necesitamos recrear: Tablas, estructuras, índices

## ✅ Paso a Paso de Recuperación

### **PASO 1: Conectar a PostgreSQL en EasyPanel**

1. Ve a tu panel de **EasyPanel**
2. Busca la instancia de **PostgreSQL**
3. Accede a la consola SQL/pgAdmin o usa DBeaver

### **PASO 2: Crear la Base de Datos (si no existe)**

```sql
CREATE DATABASE fla_academia;
```

### **PASO 3: Seleccionar la Base de Datos**

```sql
\c fla_academia;
```

O si usas DBeaver, selecciona la BD `fla_academia`

### **PASO 4: Ejecutar el Script de Recuperación**

**Opción A - Si tienes acceso al archivo:**
1. Abre el archivo: `RECOVERY_SCRIPT.sql` del proyecto
2. Copia TODO el contenido
3. Pega en la consola SQL de tu administrador de PostgreSQL
4. Ejecuta (Ctrl+Enter o botón Run)

**Opción B - Si usas terminal PostgreSQL:**
```bash
psql -U usuario_postgres -d fla_academia -f RECOVERY_SCRIPT.sql
```

### **PASO 5: Verificar que las Tablas se Crearon**

Ejecuta este comando en PostgreSQL:
```sql
\dt
```

Deberías ver:
- ✅ alumnos
- ✅ leads
- ✅ horarios
- ✅ alumnos_horarios
- ✅ conocimiento_academia
- ✅ academia_config
- ✅ conversation_log

### **PASO 6: Verificar Estructura de Tabla ALUMNOS**

```sql
\d alumnos
```

Deberías ver columnas como:
- id, nombre, whatsapp, email, estado, origen, categoria, horarios, etc.

### **PASO 7: Cargar Datos de Ejemplo (OPCIONAL)**

Si quieres datos de prueba, ejecuta:
```bash
psql -U usuario_postgres -d fla_academia -f scripts/insert-test-data.sql
```

## 🔍 Solución de Problemas

### **Error: "relation alumnos already exists"**
- Significa que la tabla ya existe (OK, ignora)
- Usa `CREATE TABLE IF NOT EXISTS` (ya lo tiene el script)

### **Error: "constraint already exists"**
- Normal si ejecutas el script dos veces
- Usa el script con `IF NOT EXISTS` (ya lo tiene)

### **Error: "permission denied"**
- Asegúrate de estar logueado con usuario admin de PostgreSQL
- En EasyPanel, usa las credenciales correctas

## 📋 Estructura de Tablas Creadas

### **Tabla: alumnos** (Post-venta)
- Estados: REGISTRADO, ACTIVO, PAUSADO, BAJA
- Campos: nombre, whatsapp, email, categoria, nivel, origen, horarios

### **Tabla: leads** (Pre-venta)
- Estados: NUEVO, FRIO, TIBIO, CALIENTE
- Campos: nombre, whatsapp, email, categoria, origen, objetivo, resumen

### **Tabla: horarios** (Clases)
- Campos: dia_semana, hora_inicio, hora_fin, profesor, nivel, cupo

### **Tabla: conocimiento_academia** (Base de conocimiento del Agente)
- Categorías: PRECIOS, FAQ, METODOLOGIA, CLASES
- Segmentos: KIDS, ADULTOS, AU_PAIR, PERSONALIZADO, GENERAL

### **Tabla: alumnos_horarios** (Relación N:M)
- Vincula alumnos con horarios

## 🚀 Siguiente: Configurar n8n

Una vez la BD esté recreada:

1. En **n8n**, los workflows buscarán las tablas
2. Carga los workflows desde: `n8n-workflows-backup 28-04-26`
3. Verifica conexión a PostgreSQL en n8n
4. Prueba un workflow simple para confirmar conexión

## ✨ ¿Necesitas ayuda?

Si hay errores SQL específicos:
1. Copia el mensaje de error exacto
2. Menciona en qué paso falla
3. Especifica qué BD admin usas (pgAdmin, DBeaver, Terminal, etc.)
