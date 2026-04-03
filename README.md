# 🏀 NG-E Basket Tech - Producto 2

Aplicación Angular de gestión de plantillas de baloncesto.

- Framework: Angular 21
- Estilo: Bootstrap 5
- Backend: Firebase (Firestore/Hosting, según configuración del proyecto)

## Requisitos previos

1. Node.js 18+ y npm 10+
2. Angular CLI 21.x (opcional pero recomendado)

Instalar Angular CLI globalmente (si no está instalado):

```bash
npm install -g @angular/cli
```

## Instalación

Clonar el repositorio y ejecutar:

```bash
npm install
```

## Estructura principal del proyecto

- `src/app/app.ts` y rutas en `src/app/app.routes.ts`
- Componentes:
  - `src/app/playersComponent` (lista de jugadores)
  - `src/app/detailComponent` (detalle de jugador)
  - `src/app/common/navbar` (barra de navegación)
- Servicios:
  - `src/app/common/datos/jugadores.service.ts`
- Pipes personalizados:
  - `src/app/common/pipes/player-filter.pipe.ts`, `src/app/common/pipes/label.pipe.ts`
- Assets en `public/assets/photos`
- Configuración de entorno en `src/environments`

## Configuración de Firebase (opcional)

1. Crear proyecto en Firebase
2. Editar `src/environments/environment.ts` y `src/environments/environment.prod.ts` con tus credenciales
3. Instalar Firebase + AngularFire si no están:

```bash
npm install firebase @angular/fire
```

## Desarrollo

Arrancar servidor local:

```bash
ng serve
```

Abrir navegador en:

`http://localhost:4200/`

La app se recarga automáticamente al modificar archivos.

## Build de producción

```bash
ng build --configuration production
```

Salida en `dist/`.

## Tests

### Unitarios

```bash
ng test
```

### E2E

```bash
ng e2e
```

> Nota: revisa la configuración de e2e en `angular.json` (puede requerir Cypress u otro runner).

## Recursos

- Angular CLI: https://angular.dev/tools/cli
- Angular: https://angular.dev
- Firebase: https://firebase.google.com
