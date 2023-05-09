document.addEventListener('DOMContentLoaded', () => {
    const itemLookupCheckbox = document.getElementById('item-lookup');
    const raidInfoCheckbox = document.getElementById('raid-info');
    const autoHealCheckbox = document.getElementById('auto-heal');

    itemLookupCheckbox.addEventListener('change', (event) => {
        chrome.storage.sync.set({ itemLookupEnabled: event.target.checked });
    });

    raidInfoCheckbox.addEventListener('change', (event) => {
        chrome.storage.sync.set({ raidInfoEnabled: event.target.checked });
    });

    autoHealCheckbox.addEventListener('change', (event) => {
        chrome.storage.sync.set({ autoHealEnabled: event.target.checked });
    });

    chrome.storage.sync.get(['itemLookupEnabled', 'raidInfoEnabled', 'autoHealEnabled'], ({ itemLookupEnabled, raidInfoEnabled, autoHealEnabled }) => {
        itemLookupCheckbox.checked = itemLookupEnabled;
        raidInfoCheckbox.checked = raidInfoEnabled;
        autoHealCheckbox.checked = autoHealEnabled;
    });
});
