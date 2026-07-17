# GRFA — Taller de Escritura Académica (versión Netlify, sin IA)

Esta carpeta contiene la app lista para desplegarse en Netlify. La retroalimentación se genera
con un **chequeo automático por reglas** (sin llamadas a ningún modelo de IA), y el progreso se
guarda con Netlify Blobs.

## Estructura

```
index.html                       ← la app (antes GRFA_App_4.html)
netlify/functions/records.js    ← reemplaza a window.storage usando Netlify Blobs
netlify.toml                     ← configuración de build/funciones
package.json                     ← dependencia @netlify/blobs
```

## Cómo funciona la retroalimentación ahora

No hay ninguna llamada a `api.anthropic.com` ni a ningún otro proveedor de IA. La función
`analyzeTextRules()` dentro de `index.html` analiza el texto del estudiante con reglas fijas:

- **Cohesión**: cuenta conectores lógicos (sin embargo, por lo tanto, además...).
- **Coherencia**: número de párrafos y longitud promedio de las oraciones.
- **Argumentación**: presencia de frases que marcan una tesis y de referencias a evidencia.
- **Normas APA**: presencia de citas tipo (Autor, año) y de una sección de referencias.

Esto significa que **no necesitas ninguna clave de API ni variable de entorno para la IA** —
el costo de esta parte es $0, siempre, porque todo corre en el navegador del estudiante.

## Pasos para publicar

1. **Sube esta carpeta a un repositorio de GitHub/GitLab** (o usa `netlify deploy` con la CLI
   si prefieres no usar git).

2. **Crea el sitio en Netlify** (https://app.netlify.com) → "Add new site" → conecta el
   repositorio. Netlify detecta `netlify.toml` automáticamente.

3. **Despliega.** Netlify instalará `@netlify/blobs`, empaquetará la función de almacenamiento
   y publicará el sitio. Netlify Blobs se activa automáticamente para el sitio, sin
   configuración extra. No hace falta ninguna variable de entorno.

4. **Prueba el flujo completo**:
   - Pega un texto en "Parte 2" y pulsa "Obtener retroalimentación automática".
   - Guarda un registro y ábrelo desde "Panel del tutor →" para confirmar que aparece.

## Notas importantes

- **Todos los estudiantes comparten el mismo almacén** (`grfa-records`), igual que antes. Si en
  el futuro necesitas separar por curso o por profesor, se puede prefijar las claves (ej.
  `curso123:record:...`) — avísame y lo ajusto.
- **Costo total esperado: $0.** Ni el hosting (dentro del plan gratuito de Netlify para uso de
  un taller) ni la retroalimentación (no usa IA) generan cargo.
- **Límite real de este enfoque**: el chequeo detecta patrones de escritura (conectores, citas,
  extensión de párrafos), no "entiende" el argumento como lo haría una lectura humana o un
  modelo de lenguaje. Es más superficial que la versión con IA, pero es gratuito y funciona sin
  conexión a ningún servicio externo.
- **Dominio propio**: puedes conectar un dominio personalizado desde *Domain management* en
  Netlify una vez el sitio esté funcionando.
- Si algo fallara al guardar registros, revisa los *Function logs* en Netlify (Site → Logs →
  Functions) para la función `records`.
