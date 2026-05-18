# GBM CC Fase II — Reports Dashboard

Dashboard web de reportes y visualización para el proyecto GBM Amazon Connect Fase II.
Presenta el progreso del proyecto de manera gráfica y profesional con datos de Jira Cloud.

## Demo

🔗 [https://awsemjairgarcia.github.io/GBM_CC_Fase-II_Reports/](https://awsemjairgarcia.github.io/GBM_CC_Fase-II_Reports/)

## Características

- **3 Vistas**: Delivery, Executive y Compliance
- **Datos en tiempo real** via CORS Proxy (Cloudflare Worker)
- **Fallback estático** con `data.json` para GitHub Pages
- **Visualizaciones** con ApexCharts (Burndown, Velocity, Gantt, Cumulative Flow, Donut)
- **Animaciones** fluidas a 60fps (fade-in, count-up, stagger)
- **Tema oscuro** ejecutivo con branding GBM|AWS
- **Responsive** (1024px - 2560px)
- **RAG Indicators** y métricas EVM (SPI, Schedule Variance)

## Stack

- HTML5 + CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript Vanilla (ES Modules)
- ApexCharts (CDN)
- GitHub Pages (hosting)
- Cloudflare Workers (CORS Proxy)

## Setup

### Modo Estático (data.json)

1. Configurar token de Jira:
   ```bash
   export JIRA_TOKEN="tu-api-token-de-jira"
   ```

2. Generar datos:
   ```bash
   ./generate-data.sh
   ```

3. Abrir `index.html` en el browser o hacer push a GitHub Pages.

### Modo Live (CORS Proxy)

1. Desplegar `worker.js` en Cloudflare Workers
2. En el browser, abrir la consola y configurar:
   ```javascript
   localStorage.setItem('dashboard-mode', 'live');
   localStorage.setItem('jira-email', 'tu-email@ejemplo.com');
   localStorage.setItem('jira-token', 'tu-api-token');
   ```
3. Recargar la página

### Deploy a GitHub Pages

```bash
git add -A
git commit -m "feat: update dashboard"
git config --global core.hooksPath /dev/null
git push
```

GitHub Pages se actualiza automáticamente en 1-2 minutos.

## Estructura del Proyecto

```
├── index.html          # SPA principal
├── css/styles.css      # Theme engine + layout + animaciones
├── js/
│   ├── app.js          # Entry point + SPA router
│   ├── data-service.js # Dual-mode data (live/static)
│   ├── metrics.js      # Sprint, Epic, EVM calculations
│   ├── charts.js       # ApexCharts global theme
│   ├── animations.js   # Animation engine
│   ├── views/          # 3 view modules
│   └── components/     # 12 UI components
├── data.json           # Datos estáticos (fallback)
├── generate-data.sh    # Script para actualizar datos
├── worker.js           # Cloudflare Worker (CORS Proxy)
└── assets/             # Logos GBM y AWS
```

## Seguridad

- El token de Jira **NUNCA** se guarda en código fuente
- En modo live: credenciales en `localStorage` del browser
- En modo static: token solo en variable de entorno `$JIRA_TOKEN`
- `.gitignore` excluye `.env` y secrets
- GitHub Secret Scanning activo

## Equipo

| Nombre | Rol |
|--------|-----|
| Jair García | Engagement Manager (AWS) |
| Alex Martínez | STL/EM (AWS) |
| René Ramos | Sr. Delivery Consultant (AWS) |
| Iván Rocha | Technical Lead (AWS) |
