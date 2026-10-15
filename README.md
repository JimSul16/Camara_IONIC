<div align="center">
  <img src="https://img.icons8.com/fluency/120/000000/slr-camera.png" alt="Obsidian Lens Logo"/>
  <h1>📷 Obsidian Lens - Aplicación Móvil de Cámara Réflex y Galería Persistente</h1>
  <p><em>Aplicación móvil híbrida de alto rendimiento desarrollada con Ionic Framework, Angular y Capacitor para la asignatura de Aplicaciones Móviles 2026-B. Diseñada bajo la estética anti-genérica "Obsidian Lens", con telemetría de cámara réflex, almacenamiento físico en dispositivo, visor de metadatos RAW, tests unitarios automatizados y compilación APK directa por terminal.</em></p>

  <p>
    <img src="https://img.shields.io/badge/Ionic-9.0.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white" alt="Ionic" />
    <img src="https://img.shields.io/badge/Angular-22.1.7-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
    <img src="https://img.shields.io/badge/Capacitor-8.5.3-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" />
    <img src="https://img.shields.io/badge/Android_SDK-API_36-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android" />
    <img src="https://img.shields.io/badge/Gradle-8.14.3-02303A?style=for-the-badge&logo=gradle&logoColor=white" alt="Gradle" />
    <img src="https://img.shields.io/badge/Vitest-QA_Passed-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

## 📖 Descripción del Proyecto
**Obsidian Lens** es una solución móvil desarrollada para la asignatura de **Aplicaciones Móviles 2026-B**. Su objetivo es proporcionar una experiencia inmersiva para la captura, procesamiento y administración física de fotografías mediante dispositivos móviles Android y entornos web modernos.

El proyecto rompe con las plantillas predeterminadas incorporando una dirección de arte propia: **"Obsidian Lens" (Studio Darkroom Aesthetic)**, inspirada en visores ópticos de cámaras profesionales con telemetría en tiempo real, HUD reactivo, retroalimentación táctil de obturador y persistencia dual segura en el sistema de ficheros del sistema operativo (`Directory.Data`).

---

## ✨ Características Principales
- 📸 **Captura Fotográfica Dual:** Acceso directo a la cámara física con calidad configurable mediante `@capacitor/camera` y selector de fotos existentes del carrete del teléfono.
- ⚡ **Telemetría Réflex (HUD):** Barra superior de estado con indicadores de preparación del sensor (`RDY`), selector de sensibilidad (`ISO 100`), formato (`RAW+JPG`), estado de flash (`AUTO`) y contador dinámico de fotografías.
- 🎯 **Visor Réflex con Guías de Enfoque:** Zona de encuadre en tarjeta elevada con marcas de enfoque en las cuatro esquinas, retícula central cruzada `[+]` y previsualización inmediata de la última captura.
- 💾 **Persistencia Física en Almacenamiento Local:** Guardado real de binarios en el almacenamiento del dispositivo con `@capacitor/filesystem` (`Directory.Data`) y sincronización de metadatos JSON con `@capacitor/preferences`.
- 🔍 **Inspector de Metadatos RAW a Pantalla Completa:** Modal de inspección detallada con zoom visual, fecha y hora exacta de disparo, peso en KB, formato y ruta física en memoria.
- 🗑️ **Eliminación Física Segura:** Confirmación previa mediante diálogo de alerta nativo (`ion-alert`) antes de suprimir permanentemente el fichero del disco.
- 📱 **Compilación APK Automatizada:** Generación completa del paquete `CamaraIonic-debug.apk` directamente desde la terminal con Gradle y Android SDK sin depender de la UI de Android Studio.
- ♿ **Accesibilidad WCAG 2.2:** Contraste de color certificado sobre fondos carbón (`#090d16`), tamaños de toque táctil accesibles (>44px) y etiquetas `aria-label` para lectores de pantalla.

---

## 🏗️ Arquitectura del Sistema

```mermaid
graph TD
    %% Presentation Layer
    subgraph UI [Capa de Presentación - Ionic 9 & Angular 22 Standalone]
        HUD[Barra de Telemetría HUD: RDY, ISO, RAW, Contador]
        Viewfinder[Visor Réflex con Guías de Enfoque]
        Gallery[Carrete Masonry de Miniaturas con Badges]
        Modal[Modal Inspector RAW & Metadatos]
        Shutter[Botón Flotante de Obturador con Doble Anillo]
    end

    %% Service Layer
    subgraph Services [Capa de Lógica & Reactividad]
        PhotoSvc[PhotoService: Angular Signals & Computed]
    end

    %% Native Plugins Layer
    subgraph Native [Capa de Abstracción Nativa Capacitor]
        CapCamera[@capacitor/camera]
        CapFS[@capacitor/filesystem]
        CapPrefs[@capacitor/preferences]
    end

    %% Physical Storage Layer
    subgraph Storage [Almacenamiento Físico del Sistema]
        AppData[(Almacenamiento de Datos de la App<br>Directory.Data)]
        MediaCarrete[(Galería Multimedia del Dispositivo)]
        PrefStore[(Almacenamiento Clave-Valor)]
    end

    %% Build & DevOps
    subgraph DevOps [Compilación y Empaquetado Android]
        Gradle[Gradle Wrapper 8.14.3]
        SDK[Android SDK Platform 36]
        APK[CamaraIonic-debug.apk]
    end

    %% Data Flow
    Shutter -->|Click de disparo| PhotoSvc
    Viewfinder -->|Abrir detalle| Modal
    Gallery -->|Inspeccionar / Eliminar| PhotoSvc
    PhotoSvc -->|Capturar imagen| CapCamera
    CapCamera -->|Guarda copia en carrete| MediaCarrete
    PhotoSvc -->|Escribe binario Base64| CapFS
    CapFS -->|Persiste .jpeg| AppData
    PhotoSvc -->|Guarda JSON de metadatos| CapPrefs
    CapPrefs -->|Actualiza estado| PrefStore

    Gradle -->|Compila proyecto nativo| SDK
    SDK -->|Genera binario final| APK
```

---

## 🛠️ Tecnologías y Dependencias

### Núcleo de la Aplicación
| Tecnología | Versión | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Ionic Framework** | `^9.0.0` | Componentes móviles nativos y estructura responsiva |
| **Angular** | `22.1.7` | Framework web reactivo con componentes *Standalone* y *Signals* |
| **Capacitor Core & CLI** | `8.5.3` | Puente de comunicación nativo híbrido con Android |
| **TypeScript** | `~6.0.0` | Tipado estricto y modelos de datos (`UserPhoto`) |
| **Ionicons** | `^8.1.0` | Iconografía vectorizada de control de cámara y galería |

### Plugins Nativos de Capacitor
| Plugin | Versión | Funcionalidad |
| :--- | :--- | :--- |
| **`@capacitor/camera`** | `8.2.5` | Disparo de cámara de hardware y captura de imágenes |
| **`@capacitor/filesystem`** | `8.1.5` | Guardado, lectura y borrado físico de archivos en `Directory.Data` |
| **`@capacitor/preferences`** | `8.0.1` | Persistencia persistente de metadatos e historial de capturas |
| **`@ionic/pwa-elements`** | `^3.3.0` | Soporte de cámara para pruebas locales en navegadores web |

### Entorno de Compilación Nativa Android
- **Android SDK:** Platform API 36 (`android-36`), Build-Tools 36.0.0.
- **Gradle:** Wrapper v8.14.3.
- **Java Virtual Machine:** Java JDK 24 con compatibilidad de bytecode alineada en Gradle.

---

## 🧪 Aseguramiento de Calidad (QA) y Testing

Siguiendo las mejores prácticas de ingeniería de software y automatización de pruebas (`test-automator`):

```bash
cd camara-app
npm test -- --watch=false
```

### Resultados de la Suite de Pruebas:
```
 RUN  v4.0.18 C:/Users/Asus Tuf/Documents/Aplicaciones Moviles 2026-B/Camara_IONIC/camara-app

 ✓  app  src/app/services/photo.service.spec.ts (3 tests)
 ✓  app  src/app/app.component.spec.ts (1 test)
 ✓  app  src/app/home/home.page.spec.ts (5 tests)

 Test Files  3 passed (3)
      Tests  9 passed (9)
```

- **Pruebas de Componentes:** Verificación de creación del componente `HomePage`, detección de última toma, apertura/cierre de modal de inspección y diálogo de alerta de eliminación.
- **Pruebas de Servicios:** Mocks de almacenamiento `@capacitor/preferences` y `@capacitor/filesystem`, validación de reactividad con Signals (`photoCount`, `totalStorageKb`) y actualización al eliminar fotos.

---

## 📱 Descarga y Ejecución del APK

El paquete compilado para Android se encuentra listo para instalar en la raíz del repositorio:

📦 **Ruta del ejecutable generado:**
[`./CamaraIonic-debug.apk`](./CamaraIonic-debug.apk) *(Tamaño: ~8.57 MB)*

### Instalación rápida mediante ADB en emulador o dispositivo físico conectado:
```bash
adb install -r CamaraIonic-debug.apk
```

---

## 🚀 Instalación y Despliegue Local

### 1. Requisitos Previos
- **Node.js:** v22.x o superior
- **NPM:** v10.x
- **Android SDK:** API 34 a 36 instalada
- **Java JDK:** Instalado en el sistema

### 2. Clonar e Instalar Dependencias
```bash
cd camara-app
npm install
```

### 3. Ejecutar en Navegador Web (Entorno de Desarrollo)
```bash
npx ionic serve
```
> [!NOTE]
> Gracias a `@ionic/pwa-elements`, puedes probar la captura fotográfica y la galería directamente desde tu navegador Chrome, Edge o Firefox.

### 4. Compilar la Versión Web
```bash
npm run build
```

### 5. Sincronizar y Compilar el APK de Android por Terminal
```powershell
# Sincronizar los cambios con la plataforma Android nativa
npx cap sync android

# Navegar a la carpeta nativa y compilar con Gradle
cd android
.\gradlew assembleDebug
```
El archivo resultante se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 📸 Galería de Capturas de Pantalla (Evidencias de Evaluación)

A continuación se presentan los espacios dedicados para las evidencias de ejecución de la aplicación, ubicadas en el directorio [`docs/screenshots/`](./docs/screenshots/):

| 1. Pantalla Principal & HUD Réflex | 2. Visor y Obturador Activo |
| :---: | :---: |
| ![Pantalla Principal](docs/screenshots/01_pantalla_principal.png) | ![Obturador en Acción](docs/screenshots/02_captura_obturador.png) |
| *Vista inicial con telemetría ISO y sensor listo* | *Disparo fotográfico con micro-animación táctil* |

| 3. Carrete de Fotos Guardadas | 4. Inspector RAW y Metadatos |
| :---: | :---: |
| ![Carrete de Fotos](docs/screenshots/03_galeria_fotos.png) | ![Inspector de Detalle](docs/screenshots/04_inspector_detalle.png) |
| *Cuadrícula de fotos con fecha y tamaño en KB* | *Modal a pantalla completa con ruta física de archivo* |

| 5. Confirmación de Borrado Físico | 6. Ejecución en Android |
| :---: | :---: |
| ![Diálogo de Borrado](docs/screenshots/05_confirmacion_eliminacion.png) | ![App en Android](docs/screenshots/06_app_en_android.png) |
| *Alerta de seguridad antes de eliminar del disco* | *APK instalado y funcionando en emulador/físico* |

---

## 📝 Estructura de Directorios del Repositorio

```
Camara_IONIC/
├── CamaraIonic-debug.apk          # Paquete APK ejecutable compilado listo para entregar
├── README.md                      # Documentación técnica oficial del deber
├── docs/
│   └── screenshots/               # Evidencias fotográficas de la app funcionando
└── camara-app/                    # Código fuente del proyecto Ionic & Angular
    ├── android/                   # Proyecto nativo Android con Gradle wrapper
    ├── src/
    │   ├── app/
    │   │   ├── home/              # Interfaz Obsidian Lens (HTML, SCSS, TS, Specs)
    │   │   └── services/          # PhotoService con persistencia nativa Capacitor
    │   ├── theme/                 # Paleta Studio Darkroom (variables.scss)
    │   └── global.scss            # Estilos globales y modo oscuro forzado
    ├── capacitor.config.ts        # Configuración nativa de Capacitor
    └── package.json               # Dependencias del proyecto
```

<div align="center">
  <br/>
  <i>Desarrollado para la Escuela Politécnica Nacional — Asignatura: Aplicaciones Móviles 2026-B</i>
</div>
