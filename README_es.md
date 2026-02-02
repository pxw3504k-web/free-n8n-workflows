# Colección de Flujos de Trabajo de n8n Gratuitos

<div align="center">

[English](./README.md) | [简体中文](./README_zh.md) | [日本語](./README_ja.md) | [Español](./README_es.md)

</div>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpwj19960112%2Ffree-n8n-workflows)
[![GitHub stars](https://img.shields.io/github/stars/pwj19960112/free-n8n-workflows?style=social)](https://github.com/pwj19960112/free-n8n-workflows)

🚀 **8000+ Flujos de Trabajo de n8n Verificados** - Código Abierto y Descarga Gratuita.

Deja de construir desde cero. Descubre, busca y despliega flujos de trabajo de n8n listos para producción para marketing, ventas, operaciones y automatización con IA.

<img width="2880" height="3986" alt="image" src="https://github.com/user-attachments/assets/d5bc24de-d4c2-4656-bddf-0a076914ee66" />

## Características

- 🔍 **Búsqueda y Filtros**: Explora flujos de trabajo por categoría, integración o palabra clave.
- 📦 **Descarga en un Clic**: Obtén plantillas JSON verificadas al instante.
- 🌐 **Soporte Multilingüe**: Localización en inglés y chino.
- ⚡ **Alto Rendimiento**: Construido con Next.js 14 y Supabase para velocidad.
- 🎨 **UI Moderna**: Interfaz limpia y adaptativa con soporte para modo oscuro.

## Datos y Respaldo

La base de datos completa de flujos de trabajo está incluida en este repositorio para asegurar que permanezca disponible incluso si el sitio original no funciona.

- **Formato JSON**: [`data/workflows.json`](./data/workflows.json) - Exportación completa de todos los flujos de trabajo.
- **Esquema SQL**: [`data/schema.sql`](./data/schema.sql) - Estructura de la base de datos para auto-alojamiento.

## Cómo Auto-Alojar (Self-Host)

Puedes desplegar este proyecto tú mismo usando Vercel o Docker.

### Opción 1: Vercel (Recomendado) y Supabase

1. **Haz un Fork de este repositorio**.
2. **Crea un proyecto en Supabase**:
   - Ve a [Supabase](https://supabase.com) y crea un nuevo proyecto.
   - Ejecuta el SQL de [`data/schema.sql`](./data/schema.sql) en el Editor SQL de Supabase.
   - Importa los datos de [`data/workflows.json`](./data/workflows.json) (es posible que necesites un script simple para insertar este JSON en la tabla `workflows`).
3. **Despliega en Vercel**:
   - Haz clic en el botón "Deploy with Vercel" de arriba o importa tu repositorio forked en Vercel.
   - Configura las variables de entorno:
     ```
     NEXT_PUBLIC_SUPABASE_URL=tu-url-de-proyecto
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
     NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
     ```

### Opción 2: Docker (Local / VPS)

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/yourusername/free-n8n-workflows.git
   cd free-n8n-workflows
   ```

2. **Configura el Entorno**:

   ```bash
   cp env.example .env.local
   # Edita .env.local con tus credenciales de Supabase
   ```

3. **Ejecuta con Docker**:

   ```bash
   docker build -t n8n-workflows .
   docker run -p 3000:3000 n8n-workflows
   ```

4. **Configuración de la Base de Datos**:
   Necesitarás una base de datos Postgres (o una instancia local de Supabase).
   - Inicializa la base de datos usando `data/schema.sql`.
   - Carga los datos de `data/workflows.json`.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador.

## Licencia (License)

Licencia MIT. Siéntete libre de usar y modificar para tus propias necesidades.
