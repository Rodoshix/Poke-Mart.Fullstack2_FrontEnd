# Poké Mart Fullstack 2 · React

Aplicación front-end de comercio electrónico de la tienda Poké Mart. Incluye vitrina pública, flujo de compra y un panel administrativo completo para gestionar catálogo, usuarios, órdenes y reportes con datos de ejemplo almacenados localmente.

## Tabla de contenidos
- [Contexto](#contexto)
- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Guía de inicio rápido](#guía-de-inicio-rápido)
- [Configuración y datos](#configuración-y-datos)
- [Tests y calidad](#tests-y-calidad)
- [Credenciales de ejemplo](#credenciales-de-ejemplo)
- [Resolución de problemas](#resolución-de-problemas)
- [Licencia](#licencia)

## Contexto
Este repositorio corresponde a la versión React del proyecto **Poké Mart Fullstack 2**. Está construido con Vite y React Router, utiliza Bootstrap 5 para estilos y replica el flujo de una tienda online con un dashboard administrativo enfocado en el seguimiento de inventario, ventas y usuarios. Todos los datos se cargan desde archivos locales (`src/data`) y se complementan con persistencia en `localStorage`/`sessionStorage` para simular operaciones CRUD sin backend.

## Características principales
- **Tienda online**
  - Home con hero, carrusel y productos destacados.
  - Catálogo con filtros, buscador, paginación y categorías dinámicas.
  - Vista de detalle de producto con control de stock y variantes multimedia.
  - Blog, ofertas, reseñas, contacto, registro y páginas informativas.
  - Carrito persistente en `localStorage`, validaciones de stock y flujo de checkout con páginas de éxito y error.
- **Panel administrativo**
  - Autenticación basada en `sessionStorage` y guardas de ruta.
  - Dashboard con métricas calculadas (órdenes, inventario, usuarios) y accesos rápidos.
  - Gestión de productos (creación, edición, filtros, restauración de catálogo, reportes y detección de críticos).
  - Módulos para órdenes, detalles de compra, categorías, usuarios, historial de clientes, ofertas y reportes ejecutivos.
  - Hooks reactivos (`useProductsData`, `useOrdersData`, `useUsersData`, etc.) que sincronizan cambios vía eventos de `localStorage`.
- **Experiencia y soporte**
  - Alias `@` para importaciones absolutas configurado en `vite.config.js`.
  - Componentes reutilizables, estilos modulares en `src/assets/styles` y assets multimedia organizados en `src/assets/img`.
  - Amplia batería de pruebas unitarias/componentes con Vitest + Testing Library.

## Stack tecnológico
- React 19 + React Router 7.
- Vite 7 como bundler y servidor de desarrollo.
- Bootstrap 5.3 y Popper.js para UI responsiva.
- Vitest 4, @testing-library/react y happy-dom para pruebas.
- ESLint 9 con reglas para React y hooks.

## Estructura del proyecto
```text
Poke-Mart.Fullstack2_React/
├─ src/
│  ├─ assets/          # Imágenes y estilos globales
│  ├─ components/      # UI modular (tienda, admin, comunes)
│  ├─ data/            # Datos semilla (productos, blogs, usuarios, órdenes)
│  ├─ hooks/           # Custom hooks (auth, formularios, datasets)
│  ├─ lib/             # Utilidades de dominio (carrito, ofertas)
│  ├─ pages/           # Rutas organizadas en tienda/ y admin/
│  ├─ services/        # Servicios de datos con persistencia localStorage
│  ├─ utils/           # Helpers genéricos (formato dinero, imágenes)
│  ├─ App.jsx          # Definición de rutas principales
│  ├─ main.jsx         # Punto de entrada con BrowserRouter
│  └─ setupTests.js    # Configuración global de pruebas
├─ vite.config.js
├─ package.json
└─ README.md
```

## Scripts disponibles
| Comando            | Descripción                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `npm run dev`      | Inicia el servidor de desarrollo de Vite con recarga en caliente.           |
| `npm run build`    | Genera la versión optimizada para producción en `dist/`.                    |
| `npm run preview`  | Sirve la build generada para validación previa al deploy.                   |
| `npm run lint`     | Ejecuta ESLint sobre todo el proyecto.                                      |
| `npm run test`     | Corre la suite de Vitest en modo CLI.                                       |

## Guía de inicio rápido
1. **Requisitos**: Node.js 18+ (recomendado 20 LTS) y npm.
2. **Instalación**:
   ```bash
   npm install
   ```
3. **Modo desarrollo**:
   ```bash
   npm run dev
   ```
   Abrir el enlace que entrega Vite (por defecto http://localhost:5173).
4. **Build de producción**:
   ```bash
   npm run build
   npm run preview
   ```

## Configuración y datos
- Los archivos semilla viven en `src/data` (`productos.json`, `blogs.json`, `reviews.json`, `users.json`, etc.).
- Los servicios (`src/services/*.js`) normalizan la data y escriben cambios en `localStorage` usando claves propias (`pokemart.admin.*`, `pm_registeredUsers`, etc.).
- Cada módulo exporta funciones de administración (`createProduct`, `updateUser`, `resetOrders`, etc.) que se consumen desde el panel. También pueden invocarse manualmente desde la consola del navegador durante el desarrollo.
- El carrito utiliza `src/lib/cartStore.js` para persistir cantidades, disparar eventos `cart:updated` y mantener el contador global.
- Las sesiones de autenticación (`AuthMenu`, `useAuthSession`) se respaldan en `sessionStorage` mediante `src/components/auth/session.js`.

## Tests y calidad
- Ejecutar `npm run test` para la suite unitaria/componentes. Se utiliza `happy-dom` como entorno DOM y `@testing-library/jest-dom` para matchers extendidos.
- `npm run lint` ayuda a mantener la base alineada con las reglas de React y hooks.
- Las pruebas se encuentran junto a los componentes (`*.test.jsx`) cubriendo formularios, tablas, filtros y vistas clave.

## Credenciales de ejemplo
- **Administrador**: usuario `admin`, contraseña `admin123`.
- **Clientes de prueba**: `ash/pikachu`, `misty/togepi`, `brock/onix123`, entre otros definidos en `src/data/users.json`.

## Resolución de problemas
- **Redirección al home al entrar a /admin**: confirma que iniciaste sesión con rol `admin`; de lo contrario, el layout redirige automáticamente.
- **Datos desincronizados**: desde el panel de productos u órdenes puedes restaurar al dataset original, o bien limpiar el `localStorage` del navegador para reiniciar el estado.
- **Assets que no cargan**: asegúrate de servir la app con `npm run dev` o `npm run preview` para que Vite resuelva correctamente las rutas de `/src/assets`.
- **Errores de pruebas relacionados a fetch/DOM**: Vitest usa `happy-dom`; si necesitas APIs adicionales, agrégalas en `src/setupTests.js`.

## Licencia
Distribuido bajo licencia **ISC** (ver `package.json`).
