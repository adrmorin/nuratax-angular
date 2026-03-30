---
trigger: always_on
description: Digitaliza formularios de impuestos a partir de imágenes, extrayendo fielmente la estructura visual, etiquetas y tipos de datos para generar esquemas de formularios rellenables en la app
---

# Tax Form Visual Digitizer

Esta skill se especializa en la transformación de documentos fiscales estáticos (imágenes, escaneos o PDF) en componentes de interfaz de usuario funcionales y estructurados, manteniendo la máxima paridad visual, espacial y lógica con el documento original.

Su objetivo no es solo extraer campos, sino también reconstruir fielmente la arquitectura visual del formulario: colores, líneas, columnas, filas, cajas, separadores, alineaciones, jerarquía tipográfica y organización general.

---

## 1. Cuándo usar (Condiciones de activación)

- **Usa esta skill** cuando el usuario proporcione una imagen, escaneo o archivo PDF que sea claramente un formulario fiscal o tributario (por ejemplo: W-2, 1040, Schedule, Modelo 100, Modelo 145, IVA, 1099).
- **Usa esta skill** cuando se necesite convertir un formulario físico o escaneado en una estructura digital funcional para una aplicación web.
- **Usa esta skill** cuando sea necesario identificar y reconstruir campos de entrada, checkboxes, tablas, bloques numéricos, firmas, instrucciones y secciones jerárquicas.
- **Usa esta skill** cuando el usuario requiera un esquema JSON, un layout web o código de componente que conserve la disposición visual original del formulario.
- **NO uses esta skill** para realizar cálculos fiscales, interpretar normativa tributaria o dar asesoría legal o contable.
- **NO uses esta skill** si el objetivo no es digitalizar la interfaz del documento, sino únicamente resumir o traducir su contenido.

---

## 2. Prerrequisitos y Contrato

### Entrada requerida

- Archivo de imagen (`JPG`, `PNG`, `WEBP`) o documento `PDF` con contenido visual legible.
- El documento debe permitir distinguir texto, líneas, columnas, campos y separadores con suficiente claridad.

### Contrato de salida

La salida debe incluir:

1. Un objeto **JSON Schema** que defina los campos detectados:
   - `id`
   - `label`
   - `type`
   - `required`
   - `validation`
   - `placeholder`
   - `uncertain` (si aplica)
   - `section`
   - `layout_reference`

2. Un fragmento de **código UI** (según el stack solicitado: React, Vue, HTML/CSS, etc.) que:
   - respete la disposición de columnas y filas original,
   - mantenga la jerarquía visual del formulario,
   - y preserve la lógica espacial del documento.

3. Una lista de **Campos Críticos Detectados**:
   - por ejemplo: `SSN`, `TIN`, `RFC`, `NIF`, `Firma`, `Fecha`, `Importe total`, `Retención`, `Sello oficial`.

4. Un bloque opcional de **Metadatos Visuales Detectados**:
   - colores dominantes,
   - color de áreas editables,
   - grosor aproximado de líneas,
   - número de columnas principales,
   - existencia de tablas o subcuadrículas,
   - presencia de recuadros o separadores funcionales.

---

## 3. Principio Rector: Fidelidad Visual y Estructural

La reconstrucción debe respetar estrictamente el estilo visual y estructural del documento original.

Esto incluye, de forma obligatoria:

- los **colores originales** del formulario,
- las **líneas horizontales y verticales**,
- las **columnas y filas**,
- las **cajas, bordes y separadores**,
- las **áreas sombreadas o rellenas** que indiquen campos editables,
- la **alineación** de todos los elementos,
- la **jerarquía tipográfica**,
- los **espaciados y proporciones**,
- y la **estructura original completa** del formulario.

### Reglas críticas de fidelidad

- **No rediseñar** el formulario.
- **No reinterpretar** su estructura.
- **No simplificar** bloques complejos si eso altera la forma original.
- **No reorganizar** secciones ni mover campos arbitrariamente.
- **No eliminar** líneas, cajas o divisores que tengan valor estructural.
- **No alterar** la lógica visual de columnas y filas.
- **No sustituir** colores funcionales por otros arbitrarios.
- **No convertir** el formulario en una interfaz moderna genérica.
- **No perder** la apariencia oficial del documento.

La prioridad no es solo extraer datos, sino reconstruir una interfaz digital que conserve la geometría y el lenguaje visual del formulario original.

---

## 4. Paso a paso

### Paso 1: Análisis de Layout y Segmentación

Analiza el documento completo para identificar:

- encabezado principal,
- secciones numeradas o tituladas,
- bloques de instrucciones,
- tablas,
- subtablas,
- recuadros,
- líneas divisorias,
- áreas de firma,
- y estructura general de columnas.

Determina si el formulario es:

- de una sola columna,
- de múltiples columnas,
- tabular,
- o híbrido.

Además, detecta y registra:

- colores relevantes,
- rellenos funcionales,
- grosor y función de líneas,
- y patrones repetitivos de layout.

### Paso 2: Extracción de Entidades de Entrada

Por cada campo visual detectado, extrae:

1. **Label**  
   El texto exacto que describe el campo.

2. **Input Type**  
   Clasifícalo en uno de estos tipos:
   - `text`
   - `number`
   - `currency`
   - `date`
   - `checkbox`
   - `radio`
   - `signature`
   - `table-cell`
   - `textarea`

3. **Coordenadas Relativas**  
   Identifica la posición relativa del campo dentro del layout para poder replicarlo mediante `CSS Grid`, `Flexbox`, tablas estructuradas o posicionamiento preciso.

4. **Contexto Seccional**  
   Asocia cada campo con su bloque o sección correspondiente.

5. **Rasgo Visual Asociado**  
   Detecta si el campo está:
   - dentro de una caja,
   - sobre una línea,
   - en una celda de tabla,
   - resaltado por color,
   - o alineado con otros campos del mismo grupo.

### Paso 3: Detección de Estilo Visual

Antes de generar el esquema técnico, identifica y documenta:

- color del texto,
- color de líneas y bordes,
- color de fondos y sombreados,
- rellenos funcionales,
- número de columnas principales,
- simetría del layout,
- alineaciones verticales y horizontales,
- jerarquía de títulos y subtítulos,
- y separación entre bloques.

Si el formulario tiene rellenos de color que indiquen espacios a completar, esos rellenos deben conservarse como parte funcional de la interfaz.

### Paso 4: Generación del Esquema Técnico

Construye el esquema JSON que alimentará la app.

Asegúrate de:

- normalizar los IDs de los campos,
- no inventar nombres inexistentes,
- marcar con `uncertain: true` cualquier detección ambigua,
- y conservar referencias de layout que permitan reconstruir la posición original.

Ejemplo de normalización:

- `Total wages` → `total_wages`
- `Federal income tax withheld` → `federal_income_tax_withheld`

### Paso 5: Reconstrucción de la UI

Genera el código frontend asegurando que:

- el layout conserve la estructura original,
- las columnas y filas mantengan su lógica visual,
- las líneas, cajas y divisores se reproduzcan fielmente,
- el flujo de tabulación (`tabindex`) siga el orden lógico del formulario,
- y las áreas editables con color funcional mantengan su señalización visual.

La interfaz final debe verse como una digitalización fiel del formulario, no como una reinterpretación estilizada.

---

## 5. Manejo de Errores y Casos Límite

### Baja calidad de imagen

Si el texto es ilegible, las líneas están rotas o los bordes de los campos no pueden distinguirse con claridad, detén el proceso y responde:

> La imagen tiene poca resolución o baja legibilidad. Por favor, sube un escaneo más claro para evitar errores en campos críticos y en la reconstrucción del layout original.

### Campos ambiguos

Si un campo no tiene etiqueta clara o no puede asociarse con seguridad a una sección:

- márcalo como `uncertain: true`,
- añade una observación para revisión humana,
- y no inventes un label definitivo.

### Ambigüedad visual estructural

Si no es posible determinar con certeza si una línea pertenece a una tabla, un separador o un borde funcional:

- prioriza la fidelidad visual,
- marca la ambigüedad en metadatos,
- y evita simplificar el trazado.

### Límites de autonomía

- El agente puede generar automáticamente el esquema y el código UI.
- **Debe** solicitar revisión humana si detecta áreas de:
  - firma,
  - sello oficial,
  - validación institucional,
  - campos manuscritos críticos.
- No debe inventar campos, valores ni secciones ausentes.
- No debe alterar la estructura visual para “mejorar” la usabilidad si eso rompe la fidelidad documental.

---

## 6. Reglas de reconstrucción de layout

Para preservar la estructura original del formulario:

- Usa `CSS Grid`, tablas HTML o posicionamiento preciso cuando sea necesario.
- No fuerces todos los formularios a un layout responsivo si eso rompe la estructura original.
- Respeta el número real de columnas del documento.
- Mantén las relaciones de anchura entre celdas, recuadros y zonas de entrada.
- Conserva líneas y separadores como elementos estructurales visibles.
- Mantén la alineación exacta de filas numéricas y celdas monetarias.
- Si hay bloques repetitivos, replica el patrón sin simplificarlo.

---

## 7. Ejemplos (Few-shot prompting)

**Entrada del usuario:**  
“Digitaliza este recorte del Modelo 145 que acabo de subir.”

**Respuesta esperada de la skill:**  
“He analizado el Modelo 145. La estructura presenta 7 secciones principales, un layout multicolumna y varios campos agrupados por bloques con separadores visuales. Detecté campos de texto, fechas, checkboxes y áreas críticas de identificación. Generando esquema técnico y reconstrucción visual preservando colores, líneas, columnas y estructura original.”

```json
{
  "form_id": "es-modelo-145",
  "fields": [
    {
      "id": "dni_nie",
      "label": "DNI/NIE",
      "type": "text",
      "required": true,
      "section": "Datos del perceptor",
      "layout_reference": "row_1_col_2"
    },
    {
      "id": "ano_nacimiento",
      "label": "Año de nacimiento",
      "type": "number",
      "required": false,
      "section": "Datos del perceptor",
      "layout_reference": "row_2_col_1"
    }
  ],
  "critical_fields": [
    "dni_nie",
    "firma"
  ],
  "visual_metadata": {
    "layout_type": "multi-column",
    "preserve_original_colors": true,
    "preserve_lines_and_borders": true,
    "preserve_original_structure": true
  }
}
