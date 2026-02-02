// Detect if we are using a dev server (Live Server, Vite, etc.) or the actual Backend
const devPorts = ["5500", "5501", "5502", "5503", "3000", "3001"];
const isDevServer = devPorts.includes(window.location.port);

window.API_BASE_URL = isDevServer
    ? `http://${window.location.hostname}:5000/api`
    : window.location.origin + "/api";
