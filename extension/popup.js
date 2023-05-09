document.addEventListener('DOMContentLoaded', () => {
    const itemLookupCheckbox = document.getElementById('item-lookup');
    const raidInfoCheckbox = document.getElementById('raid-info');

    itemLookupCheckbox.addEventListener('change', (event) => {
        chrome.storage.sync.set({ itemLookupEnabled: event.target.checked });
    });

    raidInfoCheckbox.addEventListener('change', (event) => {
        chrome.storage.sync.set({ raidInfoEnabled: event.target.checked });
    });

    chrome.storage.sync.get(['itemLookupEnabled', 'raidInfoEnabled'], ({ itemLookupEnabled, raidInfoEnabled }) => {
        itemLookupCheckbox.checked = itemLookupEnabled;
        raidInfoCheckbox.checked = raidInfoEnabled;
    });
});
