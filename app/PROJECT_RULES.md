# Reglas del Proyecto Nuratax (Angular)

Estas reglas están diseñadas para maximizar la eficiencia, escalabilidad y mantenibilidad del proyecto.

## 1. Arquitectura y Estructura de Directorios

El proyecto sigue una arquitectura estricta de separación de responsabilidades:

- **`src/app/pages/`**: Contiene los **Componentes Inteligentes (Smart Components)**.
  - Cada página debe tener su propia carpeta.
  - Son responsables de interactuar con los `Services`, obtener datos y gestionar el estado de la vista.
  - **No** deben contener estilos complejos reutilizables; deben orquestar componentes de UI.
  
- **`src/app/components/`**: Contiene los **Componentes de Presentación (Dumb/UI Components)**.
  - Deben ser lo más puros posible (reciben datos vía `@Input`, emiten eventos vía `@Output`).
  - Reutilizables en múltiples páginas.
  - Organizados por funcionalidad (`common`, `dashboard`, `home`, `forms`).

- **`src/app/services/`**: Contiene la **Lógica de Negocio y Estado Global**.
  - Gestionan llamadas HTTP e interacción con APIs.
  - Gestionan el estado de la aplicación (usando `Signals` preferiblemente).

- **`src/app/models/`**: Contiene **Interfaces y Tipos TypeScript**.
  - Define la forma de los datos (e.g., `User`, `Product`).
  - **Nunca** uses `any`. Define siempre una interfaz.

## 2. Estándares de Código (Angular Moderno)

### Componentes Standalone

- **Regla:** Todos los componentes, directivas y pipes deben ser `standalone: true`.
- Evita el uso de `NgModule` a menos que sea estrictamente necesario por una librería de terceros.

### Inyección de Dependencias

- **Regla:** Utiliza la función `inject()` en lugar de la inyección por constructor.

  ```typescript
  // ✅ Correcto
  private authService = inject(AuthService);
  
  // ❌ Evitar
  constructor(private authService: AuthService) {}
  ```

### Control Flow (Sintaxis Nueva)

- **Regla:** Utiliza la nueva sintaxis de control de flujo de Angular 17+.
  - `@if` en lugar de `*ngIf`
  - `@for` en lugar de `*ngFor`
  - `@switch` en lugar de `*ngSwitch`

### Señales (Signals) vs RxJS

- **Estado Síncrono/Local:** Usa **Signals** (`signal`, `computed`, `effect`). Son más eficientes y fáciles de leer para el estado de la UI.
- **Eventos Asíncronos/HTTP:** Usa **RxJS** (`Observable`, `Subject`). RxJS sigue siendo el rey para flujos de datos complejos y llamadas HTTP.
- **Interoperabilidad:** Usa `toSignal` y `toObservable` cuando necesites cruzar entre ambos mundos.

## 3. Rendimiento y Lazy Loading

### Enrutamiento (Router)

- **Regla CRÍTICA:** Todas las rutas deben usar **Lazy Loading** mediante `loadComponent`.
- Esto reduce drásticamente el tamaño del bundle inicial (`main.js`).

  ```typescript
  // ✅ Correcto
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  }
  
  // ❌ Evitar (Carga Eager)
  { path: 'dashboard', component: DashboardComponent }
  ```

### Detección de Cambios

- **Recomendación:** Usa `ChangeDetectionStrategy.OnPush` en componentes de presentación (`/components`) para mejorar el rendimiento, especialmente si usas Signals.

## 4. Estilos y CSS (Móvil Primero)

- **Tecnología:** Vanilla CSS (CSS puro) con variables CSS (`var(--mi-variable)`).
- **Metodología:** Usa **BEM** (Bloque Elemento Modificador) para nombrar clases y evitar colisiones.
- **Mobile First:** Escribe primero los estilos base para móvil y usa `@media (min-width: ...)` para pantallas más grandes.
- **Evitar:** No uses `!important` a menos que sea para sobrescribir estilos de librerías externas rebeldes.

## 5. Flujo de Trabajo

- **Nuevas Funcionalidades:**
  1. Define la interfaz en `models/`.
  2. Crea/actualiza el `service` con la lógica y llamadas API.
  3. Crea el componente en `pages/` (si es una vista completa) o `components/` (si es una pieza).
  4. Configura la ruta con `loadComponent`.

- **Limpieza:**
  - Ignora los directorios `app_old`, `legacy_src` y `legacy_react_backup`. No escribas código nuevo en ellos.
