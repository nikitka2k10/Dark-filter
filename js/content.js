let overlay = null;

function updateOverlay(enabled, brightness) {
  if (!enabled || brightness >= 1) {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    return;
  }

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.01);
      pointer-events: none;
      z-index: 2147483647;
      transition: backdrop-filter 0.3s ease;
    `;
    document.body.appendChild(overlay);
  }

  overlay.style.backdropFilter = `brightness(${brightness})`;
  overlay.style.webkitBackdropFilter = `brightness(${brightness})`;
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updateDarken") {
    updateOverlay(msg.enabled, msg.brightness);
  }
});