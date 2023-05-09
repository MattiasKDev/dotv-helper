chrome.storage.sync.get(['auto-healEnabled'], ({ 'auto-healEnabled': enabled }) => {
    if (!enabled) return;
    console.log("auto-heal.js loaded")
    setInterval(() => fetch("https://api.dragonsofthevoid.com/api/usable/consume/u.healing-potion", { headers: { authorization: this.localStorage.token } }), 365000);
});