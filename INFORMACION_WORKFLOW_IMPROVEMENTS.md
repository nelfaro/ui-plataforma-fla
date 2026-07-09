# Mejoras al Workflow "Informacion" - Anti-Alucinaciones

## Problema Identificado

El agente estaba **inventando información** que no existe en ninguna fuente:
- ❌ "Planes Adultos - Conversación: $200"
- ❌ "Planes Adultos - Negocio: $250"
- ❌ Información que no estaba en `conocimiento_academia` ni en `academia_config`

**Raíz del problema:**
1. El workflow SOLO consultaba `conocimiento_academia`
2. No consultaba `academia_config` (datos de contacto, políticas, horarios, etc.)
3. El prompt de OpenAI permitía alucinaciones si no encontraba contexto

---

## Solución Implementada

### Versión 2: Dual Source con Merge Node (v2-correct.json)

**Cambios principales:**

#### 1️⃣ Arquitectura: Ahora consulta AMBAS fuentes en paralelo + Merge

**ANTES:**
```
Mapear Segmentos → Build Query (conocimiento) → PostgreSQL → Procesar → OpenAI
```

**DESPUÉS:**
```
                ├─→ Build Query (conocimiento) → PostgreSQL ─┐
Mapear Segmentos ┤                                            ├→ Merge Node → Procesar Contextos → OpenAI
                └─→ Build Query (config)     → PostgreSQL ─┘
```

**Ahora consulta:**
- `conocimiento_academia`: precios, FAQs, metodología, información sobre clases
- `academia_config`: contacto, horarios, redes sociales, políticas, ubicación, datos bancarios

#### 2️⃣ Nodo "Merge Results" (BUILT-IN de n8n)

- Espera a que AMBOS nodos Postgres se ejecuten
- Combina los resultados en un solo stream
- Permite que el nodo Code siguiente procese todo correctamente

#### 3️⃣ Nodo "Procesar Contextos" (Code)

Procesa los datos ya combinados por el Merge:
- Itera sobre todos los items del merge
- Separa por tipo ('conocimiento' vs 'config')
- Construye el contexto final
- Devuelve JSON estructurado con contexto + pregunta

#### 3️⃣ Prompt de OpenAI: MÁS PROHIBITIVO

**Temperatura:** `0.1` → `0.0` (determinístico al máximo)

**Reglas nuevas:**
- 🚫 **NUNCA inventes** (aparece 4 veces en el prompt)
- 🚫 **NO agregues detalles** que no estén en contexto
- 🚫 **NO hagas listas** de opciones que no existen
- ✅ **SI falta información**: Respuesta obligatoria: *"Esa información todavía no la tengo. Voy a consultarlo con la profe Fla y te paso la info."*

**Ejemplos explícitos de qué ESTÁ PROHIBIDO:**
```
❌ "Ofrecemos planes de Conversación a $200 y Negocio a $250"
❌ "Tenemos varios programas disponibles: ..."
❌ "Generalmente las clases cuestan entre..."
```

#### 4️⃣ Fallback más fuerte

Si OpenAI alucina (cosa que no debería hacer con `temperature: 0.0`), el nodo "Retornar al Agente" garantiza que la respuesta sea el fallback:
```
"Esa información todavía no la tengo. Voy a consultarlo con la profe Fla y te paso la info."
```

---

## Cómo Implementar

### Paso 1: Actualizar el workflow en n8n

1. Abre el workflow "Informacion"
2. Reemplaza TODO el JSON con el contenido de `informacion-workflow-v2-dual-source.json`
3. Verifica que las conexiones de los nodos estén correctas (especialmente "Mapear Segmentos" → dos nodos en paralelo)
4. Prueba con un par de preguntas

### Paso 2: Verificar estructura de académia_config

Asegúrate de que la tabla `academia_config` tenga estos campos (opcional pero recomendado):

```sql
-- Estos son los campos que el workflow busca:
- nombre_profe
- email
- telefono
- instagram
- facebook
- horarios_atencion
- ubicacion
- politica_cancelacion
- politica_recuperacion
```

Si falta alguno, simplemente no lo mostrará (sin errores).

---

## Diferencias Clave vs Versión Anterior

| Aspecto | v1 | v2-correct |
|--------|----|----|
| **Fuentes consultadas** | Solo `conocimiento_academia` | `conocimiento_academia` + `academia_config` |
| **Parallelismo** | Secuencial | 2 Postgres en paralelo + Merge |
| **Integración de datos** | Un solo Code node (ERROR) | Merge built-in + Code node (CORRECTO) |
| **Temperature OpenAI** | 0.1 | 0.0 (determinístico) |
| **Fallback garantizado** | Soft | Duro (SIEMPRE se ejecuta si falta info) |
| **Prompt anti-alucinación** | Básico | Exhaustivo (prohibiciones explícitas) |
| **Máximo tokens** | 300 | 250 (más conciso) |

---

## Pruebas Recomendadas

Después de actualizar, prueba estas preguntas:

**✅ CON RESPUESTA (info en BD):**
- "¿Cuánto cuesta?" → Debe traer el precio de `conocimiento_academia`
- "¿Cuál es tu número?" → Debe traer teléfono de `academia_config`
- "¿Dónde estás?" → Debe traer ubicación de `academia_config`

**❌ SIN RESPUESTA (info NO en BD):**
- "¿Tienen plan de negocio?" → "Esa información todavía no la tengo..."
- "¿Qué precio tiene yoga?" → "Esa información todavía no la tengo..."
- "¿A qué hora abren los domingos?" → "Esa información todavía no la tengo..."

🎯 Si el agente inventa una respuesta que no está en BD → **no actualizo el workflow correctamente**

---

## Nota sobre la Alucinación

Con `temperature: 0.0`, OpenAI es muy predecible. Pero la garantía final viene del nodo "Retornar al Agente" que revisa si el contexto fue encontrado:
- Si `contexto_encontrado: true` → usa la respuesta de OpenAI
- Si `contexto_encontrado: false` → SIEMPRE retorna el fallback

Esto evita alucinaciones incluso si OpenAI tuviera un comportamiento inesperado.

