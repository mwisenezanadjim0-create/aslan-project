/**
 * Premium Toast Notification System
 * @param {string} message - The text to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showToast(message, type = 'info') {
    // Create container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon mapping
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    const icon = icons[type] || icons.info;

    toast.innerHTML = `
        <i class="fas ${icon}" style="font-size: 1.2rem; color: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#00ffdd'}"></i>
        <div class="toast-content">${message}</div>
        <div class="toast-close" onclick="this.parentElement.remove()">&times;</div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Map window.alert to showToast if we want to be aggressive,
// but it's better to explicitly use showToast.
// window.alert = (msg) => showToast(msg, 'info');
