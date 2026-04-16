<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Math.js-FFD700?style=for-the-badge&logo=javascript&logoColor=black" alt="MathJS" />
  <img src="https://img.shields.io/badge/Zustand-4A4A55?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
</div>

<h1 align="center">🌌 Calculadora Científica Integral & Motor Gráfico</h1>

<p align="center">
  <strong>Aplicación Web de Ingeniería de Alto Rendimiento orientada a la Máxima Precisión y Coherencia Visual.</strong>
</p>

<p align="center">
  Una suite matemática de la siguiente nivel construida sobre tecnologías web modernas. Diseñada obsesivamente con una filosofía visual <b>"Tech Premium"</b> (Glassmorphism, Modo Oscuro/Claro nativo interconectado y estética aeroespacial coherente).
</p>

<hr />

## ✨ Características Principales

* 🧮 **Calculadora Científica Definitiva**
  * Manejo seguro y nativo de funciones matemáticas anidadas complejas (Ej. `sin(cos(tan(45)))`).
  * **Atajos de Teclado Profesionales**: Saneamiento en tiempo real para teclado físico. Al teclear `s` despliega automáticamente `sin(`, evitando por completo errores de validación y `NaN`.
  * Adaptación tipográfica dinámica dependiendo de si estás tecleando (modo activo) o visualizando el resultado final.

* 📈 **Motor de Planos Cartesianos y Gráficos (SVG Interactivo)**
  * Gráficas algebraicas compiladas ultra-rápidas mediante la función parseadora y renderizada sin retraso visual.
  * *Drag-and-Drop* nativo: *Panning* libre arrastrando el escenario infinito y *Zooming* a través del scroll del mouse.
  * Capa de Coordenadas Analíticas: Permite plantar y editar puntos específicos y ver Tooltips dinámicos que persiguen geométricamente al cursor para leer sus datos absolutos de `X`, y `Y`.
  * Toolbar de inserción científica de un click por debajo de la consola de `f(x)`.

* 📐 **Arquitectura de Matrices Reales**
  * Define la escala de tu matriz en tiempo real para generar estructuras variables de `NxM`.
  * Resolución inmediata y responsiva que adapta el diseño (y el layout de sus celdas) de manera inteligente dependiendo del desbordamiento en pantalla del navegador sin colapsar el CSS.

* 🌗 **Ingeniería Gráfica (UI/UX)**
  * **Sistemas de diseño dinámicos**: Transición entre *"True Azure Dark"* y *"Emerald/Cyan Light"* que adapta la visibilidad de los bordes cristalinos y previene los colores opacos en temas claros.
  * Deslumbrante Fondo Interactivo de Partículas 3D.
  * Diseño estrictamente blindado basado en Flexbox Grid-Track (evita los sobre-bordes y colapsos de UI en pantallas ultra-apretadas).
  * Control absoluto de pseudo-elementos (`::selection` tematizado).

## 🛠️ Tecnologías Utilizadas

- **Núcleo Front-End**: React 18, Vite (Hot-Reload de Alta Velocidad).
- **Procesamiento Aritmético**: `math.js` configurado bajo el tipo *BigNumber* a 64 bits de precisión.
- **Gestión de Estados Globales**: Zustand (Persistencia eficiente e interacciones cross-level entre Historial, Gráficos y Variables de UI sin prop-drilling).
- **Iconografía Activa**: Lucide-React.
- **Micro-interacciones Visuales**: CSS3 Puro Vanilla con Variables Nativas `[data-theme]`. Sin dependencias monolíticas externas como Tailwind limitando el flujo. 

## 🚀 Instalación y Despliegue Local

¡Lanza la suite de desarrollo en menos de un minuto!

1. **Clonar Repositorio / Navegar a la carpeta:**
   ```bash
   cd calculadora-cientifica
   ```

2. **Instalar Dependencias de red:**
   Asegúrate de contar con Node.js `>= 18.x`.
   ```bash
   npm install
   ```

3. **Arrancar el Reactor Local (Development):**
   ```bash
   npm run dev
   ```
   *Vite alojará velozmente el proyecto en `http://localhost:5173/`.*

4. **Kompilado / Build (Producción):**
   ```bash
   npm run build
   ```
   *El output minimificado aparecerá dentro de la carpeta `/dist/`.*

## 🔒 Control de Estabilidad Matemático
La suite incluye previsiones anti-colapso `[Safe-Trig]`: El motor evalúa dinámicamente el `angleMode` (`DEG`/`RAD`) interceptando internamente cada solicitud en vez usar RegEx destructivas. Esto blinda las solicitudes anidadas al procesador.

---

<p align="center">
  <i>Diseñado con meticulosidad para un rendimiento premium, porque "Los cálculos hermosos merecen interfaces hermosas".</i>
</p>
