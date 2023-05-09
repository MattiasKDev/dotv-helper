chrome.storage.sync.get(['raid-infoEnabled'], ({ 'raid-infoEnabled': enabled }) => {
    if (!enabled) return;

    console.log("raid-info.js loaded")


    let raidData;
    chrome.storage.local.get("data", ({ data }) => {
        if (data) {
            raidData = JSON.parse(data).raids;
            console.log("Raid data loaded from local storage");
        } else {
            setTimeout(() => {
                chrome.runtime.sendMessage({ action: "retry" });
            }, 500);
        }
    });

    const uiExists = setInterval(() => {
        const appContainer = document.querySelector('#app > div > div.app-container');
        if (appContainer) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element && node.querySelector('.raid-container .boss-name-container span')) {
                            displayRaidInfo(node.querySelector('.raid-container .boss-name-container'));
                        }
                    });
                });
            });
            observer.observe(appContainer, { childList: true, subtree: true });
            clearInterval(uiExists);
        }
    }, 500);

    function displayRaidInfo(bossNameContainer) {
        const raidInfo = Object.values(raidData).find(r => r.name === bossNameContainer.firstChild.textContent);

        if (!bossNameContainer.nextSibling.querySelector('.misc')) {
            const newMiscElement = document.createElement('div');
            newMiscElement.classList.add('misc');
            newMiscElement.setAttribute('data-v-624c6570', '');
            newMiscElement.setAttribute('style', 'white-space: pre-line;');
            bossNameContainer.nextSibling.appendChild(newMiscElement);
        }

        const racesText = document.querySelector('.misc');
        racesText.style.whiteSpace = 'pre-line';
        racesText.textContent = `${raidInfo.races.join(", ")}\nweak: ${raidInfo.weakness.join(", ")}\nresist: ${raidInfo.resist.join(", ")}`;
    }
});