# ArchCode — Asistente IA para Arquitectos

> Consulta normativa técnica de edificación con inteligencia artificial. Obtén respuestas precisas sobre CTE, RITE, REBT y más — en segundos.

**Demo en vivo:** [archcode-nu.vercel.app](https://archcode-nu.vercel.app) — alojado en el plan gratuito de Vercel (sin coste, sin tarjeta de crédito).

> **Nota:** El backend (Firebase + OpenAI) está actualmente discontinuado, por lo que las funcionalidades interactivas de la herramienta no están operativas en la demo. La landing page y las páginas informativas son totalmente accesibles. Para ver la herramienta funcionando en su totalidad, consulta el vídeo demo a continuación.

---

## Demo en vídeo

[![ArchCode Demo](https://img.youtube.com/vi/hZ1zVxkGCEw/maxresdefault.jpg)](https://www.youtube.com/watch?v=hZ1zVxkGCEw)

---

## ¿Qué es ArchCode?

**ArchCode** es una herramienta web diseñada para arquitectos, aparejadores y técnicos de la construcción en España. Permite realizar consultas en lenguaje natural sobre normativa técnica de edificación, obteniendo respuestas contextualizadas con referencias a los documentos originales.

El asistente analiza los documentos normativos seleccionados en función del contexto específico de cada proyecto (tipología, zona climática, región, sistema constructivo...) y genera respuestas precisas con citas de los artículos relevantes.

---

## Estado actual

| Funcionalidad | Estado |
|---|---|
| Landing page y páginas informativas | Operativo |
| Blog | Operativo |
| Chat con IA (herramienta) | No operativo — backend discontinuado |
| Autenticación / registro | No operativo — backend discontinuado |
| Subida de PDFs | No operativo — backend discontinuado |

Para reactivar todas las funcionalidades es necesario configurar Firebase y OpenAI (ver sección de instalación).

---

## Funcionalidades principales

- **Chat con IA contextualizada** — Formula preguntas en lenguaje natural sobre normativa y recibe respuestas con referencias exactas a los documentos.
- **Gestión de proyectos** — Crea proyectos separados con su propio historial de conversación y contexto.
- **Selección de normativa** — Elige hasta 5 documentos normativos por consulta (CTE-DB-HE, DB-HR, DB-HS, DB-SE, DB-SI, DB-SUA, RITE, REBT...).
- **Metadatos de proyecto** — Define el tipo de edificio, zona climática, región, orientación y sistema constructivo para obtener respuestas más precisas.
- **Subida de PDFs propios** — Añade tus propios documentos (proyectos, memorias, fichas técnicas) para consultarlos junto con la normativa oficial.
- **Generación automática de etiquetas** — La IA sugiere metadatos adicionales a partir de la descripción del proyecto.
- **Renderizado de fórmulas** — Las respuestas pueden incluir ecuaciones y expresiones matemáticas renderizadas con KaTeX.
- **Blog de actualidad** — Sección con noticias y novedades del sector de la arquitectura y la construcción.
- **Panel de administración** — Revisión de feedback de usuarios y acceso a los PDFs subidos.

---

## Normativa soportada

| Código | Descripción |
|--------|-------------|
| CTE DB-HE | Ahorro de Energía |
| CTE DB-HR | Protección frente al Ruido |
| CTE DB-HS | Salubridad |
| CTE DB-SE | Seguridad Estructural |
| CTE DB-SI | Seguridad en caso de Incendio |
| CTE DB-SUA | Seguridad de Utilización y Accesibilidad |
| RITE | Reglamento de Instalaciones Térmicas en Edificios |
| REBT | Reglamento Electrotécnico para Baja Tensión |

---

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| Frontend | Next.js 15, React 18, Tailwind CSS, Framer Motion |
| Renderizado | React Markdown, KaTeX, MathJax |
| Backend | Firebase Cloud Functions (Node.js 18) |
| Base de datos | Firebase Firestore |
| Autenticación | Firebase Authentication |
| Almacenamiento | Google Drive API |
| IA | OpenAI API (GPT-4o-mini, Assistants API con file_search) |
| Hosting | Firebase Hosting / Vercel |

---

## Estructura del proyecto

```
archcode/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── page.js             # Landing page
│   │   ├── herramienta/        # Herramienta principal (chat)
│   │   ├── blog/               # Blog y posts individuales
│   │   ├── admin/              # Panel de administración
│   │   ├── CTE-DB-HE/          # Páginas informativas de normativa
│   │   └── ...
│   └── components/             # Componentes reutilizables
│       ├── Chat.js             # Interfaz principal de chat
│       ├── ProjectSelector.js  # Gestión de proyectos
│       ├── DocumentSelector.js # Selección de normativa
│       ├── ProjectInfo.js      # Metadatos del proyecto
│       └── ...
├── functions/                  # Firebase Cloud Functions
│   └── index.js                # handleUserQuery, generateAdditionalTags, uploadPdf
├── public/                     # Recursos estáticos
├── firebase.json               # Configuración de Firebase
├── firestore.rules             # Reglas de seguridad de Firestore
└── next.config.mjs             # Configuración de Next.js
```

---

## Instalación y desarrollo local

### Requisitos previos

- Node.js 18+
- npm
- Cuenta de Firebase
- Cuenta de OpenAI

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd archcode
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
NEXT_PUBLIC_ADMIN_EMAIL=tu_email_admin@ejemplo.com
```

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Deploy en Vercel (gratuito)

### Opción A — Deploy automático desde la web (recomendado)

1. Sube el proyecto a un repositorio de GitHub.
2. Ve a [vercel.com](https://vercel.com) e inicia sesión (gratis con GitHub).
3. Haz clic en **"Add New Project"** e importa tu repositorio.
4. En la sección **"Environment Variables"**, añade todas las variables del `.env.local`.
5. Haz clic en **"Deploy"**.

Vercel detecta automáticamente que es un proyecto Next.js y lo despliega en una URL pública gratuita.

### Opción B — Deploy desde la terminal

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde la carpeta del proyecto
cd archcode
vercel

# Seguir las instrucciones del asistente:
# - Confirmar el directorio del proyecto
# - Seleccionar tu cuenta/equipo
# - Configurar el proyecto (Next.js se detecta automáticamente)
```

Para añadir variables de entorno en el primer deploy:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Repetir para cada variable
```

O directamente en el dashboard de Vercel: **Project Settings → Environment Variables**.

### Notas sobre el deploy en Vercel

- El backend (Firebase Cloud Functions) permanece en Firebase — sólo el frontend se despliega en Vercel.
- Las variables con prefijo `NEXT_PUBLIC_` son accesibles en el cliente; el resto sólo en el servidor.
- El plan gratuito de Vercel incluye dominio `.vercel.app`, HTTPS, y deploys ilimitados desde Git.

---

## Deploy en Firebase Hosting (configuración original)

```bash
# Instalar Firebase CLI
npm i -g firebase-tools

# Build estático
npm run build

# Deploy
firebase deploy
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en localhost:3000 |
| `npm run build` | Build de producción (exportación estática a `/out`) |
| `npm run start` | Servidor de producción local |
| `npm run lint` | Linter de Next.js |

---

## Flujo de uso

```
1. El usuario crea una cuenta (email + verificación)
2. Accede a /herramienta
3. Crea un proyecto y define sus metadatos (tipología, zona climática, región...)
4. Selecciona hasta 5 documentos normativos
5. (Opcional) Sube PDFs propios al proyecto
6. Formula preguntas en el chat
7. La IA analiza los documentos en contexto y responde con referencias
```

---

## Licencia

Este proyecto es propiedad de sus autores. Todos los derechos reservados.
