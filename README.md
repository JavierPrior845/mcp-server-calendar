# Servidor MCP de Google Calendar

Este proyecto implementa un Servidor Model Context Protocol (MCP) que permite a herramientas IA conectarse e interactuar con Google Calendar.

## 🚀 Inicio Rápido

1. **Requisitos Previos**
   - Node.js (v18+)
   - Un proyecto configurado en [Google Cloud Console](https://console.cloud.google.com/) con la API de Google Calendar habilitada.
   - Archivo `.env` en la raíz con tus credenciales OAuth 2.0 (App de Escritorio):
     ```env
     CLIENT_ID=tu_client_id
     CLIENT_SECRET=tu_client_secret
     ```

2. **Instalación**
   ```bash
   npm install
   ```

3. **Autenticación (Primera vez)**
   Para autorizar el acceso a tu calendario, ejecuta el script de autenticación local. Este levantará un servidor temporal en `http://127.0.0.1:3000` para capturar el token de forma segura:
   ```bash
   npm run auth
   ```
   *Nota: Asegúrate de añadir tu correo de Gmail a la lista de **Usuarios de prueba (Test users)** en la sección de Audiencia de Google Auth Platform en tu consola de Google Cloud.*

4. **Ejecutar el Servidor**
   ```bash
   npm start
   ```

5. **Depuración y Testing**
   Puedes inspeccionar visualmente y probar las herramientas del servidor en tu navegador usando el MCP Inspector oficial:
   ```bash
   npm run inspect
   ```

## 🛠️ Herramientas Disponibles (Tools)

- `list_events`: Lista eventos de Google Calendar. Por defecto muestra la semana actual. Admite filtros por fecha única (`date`) o por rango (`startDate`/`endDate`).
- `create_event`: Crea un nuevo evento en Google Calendar. Requiere título, fecha de inicio y fecha de fin.

## ⚙️ Integración con Antigravity

Añade este servidor a tu configuración de `antigravity.json`:
```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["tsx", "/ruta/absoluta/al/proyecto/src/index.ts"]
    }
  }
}
```

## 🔗 Enlaces Útiles
- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentación Oficial de Google Calendar API](https://developers.google.com/calendar)
- [Documentación del Protocolo MCP](https://modelcontextprotocol.io/)
