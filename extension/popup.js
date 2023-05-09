document.addEventListener('DOMContentLoaded', () => {
    const checkboxIds = ['item-lookup', 'raid-info', 'auto-heal'];

    checkboxIds.forEach((id) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;

        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(id.replace('-', ' ')));

        const container = document.getElementById('checkbox-container');
        container.appendChild(label);
    });

    checkboxIds.forEach((id) => {
        const checkbox = document.getElementById(id);

        checkbox.addEventListener('change', (event) => {
            const key = `${id}Enabled`;
            chrome.storage.sync.set({ [key]: event.target.checked });
        });

        chrome.storage.sync.get(`${id}Enabled`, ({ [`${id}Enabled`]: enabled }) => {
            checkbox.checked = enabled;
        });
    });
});