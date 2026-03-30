---
trigger: always_on
---

# Reglas del Proyecto

## Filosofía central
>
> **"Legibilidad y Orden > Velocidad e Interconexiones Complejas"**

Este proyecto prioriza la mantenibilidad y la claridad sobre el código ingenioso e hiper-optimizado. Incluso si una solución es ligeramente menos eficiente pero significativamente más fácil de leer, elegid la que sea legible (con un poco de sentido común).

- **Principios SOLID**: Seguid los principios de Responsabilidad Única, Abierto-Cerrado, Sustitución de Liskov, Segregación de la Interfaz e Inversión de Dependencias para un código mantenible y extensible.
- **DRY (Don't Repeat Yourself - No te repitas)**: Evitad la duplicación de código extrayendo la lógica común en funciones, clases o módulos reutilizables.
- **KISS (Keep It Simple, Stupid - Mantenlo simple, estúpido)**: Buscad la simplicidad en el diseño y la implementación. Evitad el sobre-diseño.
- **Código Limpio**: Escribid código legible y autodocumentado con nombres significativos, funciones pequeñas y una estructura clara.
- **Manejo de Errores**: Implementad un manejo de errores y registro de logs robusto para ayudar a la depuración y mantener la fiabilidad. Usad un registro de baja cardinalidad con cadenas de mensajes estables, por ejemplo, `logger.info{id, foo}, 'Msg'`, `logger.error({error}, 'Another msg')`, etc.

## 1. Lógica y Estructura del Código

- **Explícito sobre Implícito**: Evitad las "magias" de una línea. Usad nombres de variables descriptivos.
- **Estructura de Componentes**:
  - Mantened los componentes pequeños y enfocados.
  - Cada componente debe tener un propósito claro.
- **Comentarios**:
  - Explicad *por qué*, no solo *qué* en español solamente.
  - Documentad bloques de lógica complejos bloque por bloque.

## 3. CSS y Estilos

- **CSS Vanilla / Módulos CSS**:
  - Usad archivos CSS o módulos separados para los componentes para mantener los estilos organizados.
  - Usad Variables CSS (`:root`) para temas globales (colores, espaciado, etc.).
- **Evitar**:
  - Estilos en línea (excepto para valores dinámicos).
  - Tailwind CSS (a menos que se solicite explícitamente más adelante).

## 4. Flujos de Trabajo

- Verificad siempre los cambios localmente antes de pedir una revisión.
- Seguid los flujos de trabajo definidos en `.agent/workflows/`. # Reglas del Proyecto
