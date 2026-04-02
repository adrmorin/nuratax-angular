---
description: Reconstruct IRS form with visual fidelity (one by one)
---
# Workflow: Reconstruct IRS Form

## Paso 1 – Descargar PDF oficial
```bash
# Usa la herramienta read_url_content para obtener el PDF y guardarlo en .tempmediaStorage
# Ejemplo: https://www.irs.gov/pub/irs-pdf/f8936.pdf
```

## Paso 2 – Extraer estructura visual
- Abre el PDF en el navegador (sub‑agent) y captura una captura de pantalla completa.
- Usa la skill `ui-visual-validator` para analizar la cuadrícula, líneas y cajas.
- Anota en un archivo JSON la posición de cada línea/columna y los campos de texto.

## Paso 3 – Generar componente Angular
1. Crea la carpeta `src/app/components/forms/<form-id>`.
2. Genera `*.component.ts` con ReactiveForms y `inject(FormBuilder)`.
3. Genera `*.component.html` usando **CSS Grid** basada en la información del paso 2.
4. Genera `*.component.css` siguiendo las reglas BEM, mobile‑first y variables CSS.

## Paso 4 – Registrar ruta lazy‑loaded
- Añade la entrada `{ path: '<form-id>', loadComponent: () => import('./components/forms/<form-id>/<form-id>.component').then(m => m.<PascalCase>Component) }` al final de `app.routes.ts`.

## Paso 5 – Verificación visual
- Ejecuta `npm start` y abre `http://localhost:4200/<form-id>`.
- Usa `ui-visual-validator` para comparar la UI generada con la captura del PDF.
- Corrige diferencias (ajustes de `grid-template-columns`, `gap`, bordes, colores).

## Paso 6 – Documentar
- Genera un archivo `README.md` dentro de la carpeta del formulario con:
  - Enlace al PDF oficial.
  - Tabla de campos (`id`, `label`, `type`, `required`).
  - Notas de validación y cálculos.

## Repetir
Ejecuta este flujo para cada uno de los formularios listados.

**Nota:** Cada iteración puede tardar varios minutos dependiendo de la complejidad del formulario.
