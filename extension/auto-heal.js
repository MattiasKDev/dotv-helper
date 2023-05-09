chrome.storage.sync.get(['autoHealEnabled'], ({ autoHealEnabled }) => {
    if (!autoHealEnabled) return;
    console.log("auto-heal.js loaded")
    setInterval(() => fetch("https://api.dragonsofthevoid.com/api/usable/consume/u.healing-potion", { headers: { authorization: this.localStorage.token } }), 365000);
});