# 🏀 NG-E Basket Tech - Producto 2

**NG-E Basket Tech** es una plataforma de gestión deportiva avanzada desarrollada en Angular 21. Permite a cuerpos técnicos y analistas centralizar la información de sus plantillas, realizar un seguimiento estadístico detallado y gestionar contenido multimedia de cada jugador de forma eficiente.

- **Framework**: Angular 21
- **Estilo**: Bootstrap 5
- **Backend**: Firebase (Firestore/Hosting)
- **Video Support**: YouTube URLs y archivos de video locales
- **Base de datos**: Firestore para persistencia de datos

## ✨ Características principales

### 👥 Gestión de Jugadores
- **Lista de jugadores** con filtros y búsqueda
- **Vista detallada** de cada jugador con estadísticas completas
- **Edición/creación** de perfiles de jugadores
- **Validación de datos** mediante formularios reactivos
- **Persistencia** en Firestore

### 📊 Estadísticas de Temporada
- Puntos por partido (PPP)
- Rebotes por partido (RPP)
- Asistencias por partido (APP)
- Porcentaje de tiros de campo (%TC)

### 🎥 Sistema de Video
- **Soporte para YouTube**: URLs completas o acortadas
- **Archivos de video locales**: MP4, WebM, Ogg
- **Reproductor responsive** con controles nativos
- **Componente reutilizable** (`mediaComponent`)

### 🎨 Interfaz de Usuario
- Diseño moderno con Bootstrap 5
- Navegación intuitiva
- Modo edición/creación integrado
- Responsive design

## 🏗️ Arquitectura y Flujo de Datos

La aplicación sigue una arquitectura desacoplada basada en componentes y servicios:

1.  **Capa de Persistencia (Firebase)**: Se utiliza Firestore para el almacenamiento de datos en tiempo real.
2.  **Capa de Servicios**: `jugadores.service.ts` actúa como el único punto de verdad, gestionando los Observables de RxJS para que la interfaz se actualice automáticamente ante cambios en la base de datos.
3.  **Componentización**:
    *   `playersComponent`: Dashboard principal con lógica de filtrado.
    *   `detailComponent`: Componente dual (lectura/escritura) para la gestión individual.
    *   `mediaComponent`: Módulo independiente para el renderizado inteligente de video.
4.  **Pipes**: Transformación de datos en tiempo real para búsquedas y formateo de estadísticas.

## 📋 Requisitos previos

1. **Node.js** 18+ y **npm** 10+
2. **Angular CLI** 21.x (opcional pero recomendado)

Instalar Angular CLI globalmente (si no está instalado):

```bash
npm install -g @angular/cli
```

## 🚀 Instalación y configuración

### 1. Clonar e instalar dependencias

```bash
git clone <repository-url>
cd Eloi-producto_2
npm install
```

### 2. Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Obtener credenciales del proyecto
3. Editar `src/environments/environment.ts` y `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  }
};
```

4. Instalar Firebase + AngularFire (si no están incluidos):

```bash
npm install firebase @angular/fire
```

## 🏗️ Estructura del proyecto

```
src/
├── app/
│   ├── app.routes.ts              # Configuración de rutas
│   ├── app.ts                     # Componente principal
│   ├── playersComponent/          # Lista de jugadores
│   ├── detailComponent/           # Detalle y edición de jugador
│   ├── mediaComponent/            # Reproductor de video reutilizable
│   └── common/
│       ├── datos/
│       │   └── jugadores.service.ts  # Servicio Firestore
│       ├── navbar/                # Barra de navegación
│       └── pipes/                 # Pipes personalizados
├── environments/                  # Configuración de entorno
└── assets/                        # Recursos estáticos
```

## 📊 Modelo de datos

### Jugador
```typescript
interface Jugador {
  id?: string;
  nombre: string;
  equipo: string;
  posicion: string;
  altura: string;
  edad: number;
  pPP: number;           // Puntos por partido
  rPP: number;           // Rebotes por partido
  aPP: number;           // Asistencias por partido
  porcentajeTiros: number; // % Tiros de campo
  img: string;           // URL de imagen
  videoUrl?: string;     // URL de video (YouTube o archivo local)
}
```

## 🎬 Uso del sistema de video

### URLs soportadas

**YouTube:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- Solo el `VIDEO_ID` (11 caracteres)

**Archivos locales:**
- `.mp4`, `.webm`, `.ogv`
- URLs absolutas o relativas

El sistema incorpora un motor de detección automática que distingue entre identificadores de YouTube y rutas de archivos locales para instanciar el reproductor adecuado (IFrame API o HTML5 Video Tag).

### Ejemplo de uso

```html
<app-media
  [videoUrl]="jugador.videoUrl"
  [defaultVideoSource]="'ruta/a/video/default.mp4'">
</app-media>
```

## 🛠️ Desarrollo

### Servidor de desarrollo

```bash
ng serve
```

Acceder en: `http://localhost:4200`

La aplicación se recarga automáticamente al modificar archivos.

### Build de producción

```bash
ng build --configuration production
```

Archivos generados en `dist/`.

## 🧪 Tests

### Tests unitarios

```bash
ng test
```

### Tests E2E

```bash
ng e2e
```

> Nota: Verificar configuración de e2e en `angular.json`

## 📚 Scripts disponibles

```json
{
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

## 🔧 Tecnologías utilizadas

- **Angular 21** - Framework principal
- **Bootstrap 5** - Framework CSS
- **Firebase/Firestore** - Backend y base de datos
- **RxJS** - Programación reactiva
- **Angular Router** - Estrategia de navegación SPA
- **TypeScript** - Tipado estático

## 📖 Recursos adicionales

- [Angular Documentation](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/)
- [RxJS](https://rxjs.dev/)


## 📄 Licencia

Este proyecto es parte del curso de Desarrollo de Aplicaciones Móviles - UOC.
