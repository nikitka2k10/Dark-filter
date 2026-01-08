let enabled = false;
let darknessPercent = 50;

chrome.storage.local.get(['enabled', 'darkness'], (result) => {
  enabled = result.enabled ?? false;
  darknessPercent = result.darkness ?? 50;

  document.getElementById('enabled').checked = enabled;
  document.getElementById('darkness').value = darknessPercent;
  document.getElementById('value').textContent = darknessPercent + '%';

  applySettings();
});

document.getElementById('darkness').addEventListener('input', (e) => {
  darknessPercent = parseInt(e.target.value, 10);
  document.getElementById('value').textContent = darknessPercent + '%';
  saveAndApply();
});

document.getElementById('enabled').addEventListener('change', () => {
  enabled = document.getElementById('enabled').checked;
  saveAndApply();
});

function saveAndApply() {
  chrome.storage.local.set({ enabled, darkness: darknessPercent });
  applySettings();
}

function applySettings() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (tab?.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
      const brightness = 1 - (darknessPercent / 100) * 0.9;

      chrome.tabs.sendMessage(tab.id, {
        action: "updateDarken",
        enabled: enabled,
        brightness: brightness
      }).catch((error) => {
        console.debug("Не удалось применить затемнение:", error.message);
      });
    }
  });
}