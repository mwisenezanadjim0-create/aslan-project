// Detect if we are using Live Server (5500/5501) or the actual Backend (5000)
const isLiveServer = window.location.port === "5500" || window.location.port === "5501";
window.API_BASE_URL = isLiveServer
    ? `http://${window.location.hostname}:5000/api`
    : window.location.origin + "/api";
