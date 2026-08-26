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

4. **Compilar y Ejecutar el Servidor**
   Compila el código TypeScript a JavaScript nativo:
   ```bash
   npm run build
   ```
   Ejecuta el servidor compilado:
   ```bash
   npm start
   ```

5. **Depuración y Testing**
   Puedes inspeccionar visualmente y probar las herramientas del servidor en tu navegador usando el MCP Inspector oficial:
   ```bash
   npm run inspect
   ```

## 🛠️ Herramientas Disponibles (Tools)

- `list_events`: Lista eventos de Google Calendar. Muestra la semana actual por defecto o un rango/día específico.
- `create_event`: Crea un nuevo evento en Google Calendar con título, fecha/hora de inicio y fin.
- `find_free_slots`: Busca ventanas de tiempo libres según la duración mínima requerida y una franja horaria laboral.
- `reschedule_event`: Reprograma o mueve un evento existente a un nuevo horario mediante su ID.
- `delete_or_cancel_event`: Elimina o cancela un evento del calendario usando su ID.
- `detect_conflicts`: Examina el calendario en busca de solapamientos entre actividades.
- `get_workload_analytics`: Generar métricas y desgloses de horas agendadas por categoría (`[FREELANCE]`, `[TRABAJO]`, `[FORMACION]`, etc.).

## ⚙️ Integración con Antigravity

Añade este servidor a tu configuración de `antigravity.json` (o `.gemini/config/mcp_config.json`):
```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "node",
      "args": ["/ruta/absoluta/al/proyecto/dist/index.js"]
    }
  }
}
```

---

Acontinuacion se muestra un listado de las tools disponibles (o que lo estaran) y su finalidad. Tambien se incluye un pequeño resumen de las skills con las que yo compagino este MCP para potenciar su uso.

| Tipo | Nombre | Finalidad |
| :--- | :--- | :--- |
| **[Skill]** | `planificador-semanal` | Lee proyectos activos (`01_Projects`), entregas a clientes (`02_Areas/Freelance`) y exámenes (`03_Resources/Universidad_UMU`) para proponer y agendar bloques de tiempo de estudio/trabajo en tus huecos libres de Google Calendar. |
| **[Skill]** | `sincronizador-bitacora` | Analiza tu bitácora diaria (`Daily_Work_Log.md`) al final de la jornada y actualiza el calendario ajustando los eventos planificados a las horas reales que dedicaste a cada tarea. |
| **[Skill]** | `freelance-billing-helper` | Cruza tus eventos marcados como freelance en el calendario con tu CRM local para calcular las horas dedicadas a cada cliente, registrar el progreso y preparar informes de facturación. |
| **[Skill]** | `preparador-examenes` | Detecta las fechas de exámenes en tus recursos de la UMU, calcula las horas de estudio necesarias basándose en la dificultad de la asignatura y agenda sesiones de repaso espaciadas en el calendario hasta el día del examen. |
| **[Tool]** | `list_events` *(Ya creada)* | Lista eventos del calendario principal filtrando por día específico, rango de fechas o por defecto la semana actual. |
| **[Tool]** | `create_event` *(Ya creada)* | Inserta un nuevo evento (reunión, clase, entrega) en un calendario específico con título, descripción y fecha/hora. |
| **[Tool]** | `find_free_slots` | Busca ventanas de tiempo disponibles en tu calendario según la duración requerida y respetando tus reglas (ej. "no agendar cosas de UMU durante mi horario de trabajo full-time"). |
| **[Tool]** | `reschedule_event` | Mueve un evento existente a una nueva fecha/hora, resolviendo automáticamente solapamientos sencillos si el usuario decide posponer una tarea. |
| **[Tool]** | `delete_or_cancel_event` | Elimina un evento del calendario o cancela una ocurrencia específica de una serie de eventos recurrentes. |
| **[Tool]** | `detect_conflicts` | Examina el calendario en busca de solapamientos entre actividades (ej. una reunión de freelance que choca con tus clases de la UMU o tu trabajo principal). |
| **[Tool]** | `get_workload_analytics` | Analiza el uso del tiempo en un periodo y devuelve estadísticas sobre cuántas horas has asignado a cada área (Freelance, UMU, Trabajo, Ocio) para ayudarte a balancear tu semana. |

---

## 🔗 Enlaces Útiles
- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentación Oficial de Google Calendar API](https://developers.google.com/calendar)
- [Documentación del Protocolo MCP](https://modelcontextprotocol.io/)
