chrome.storage.sync.get(['raidInfoEnabled'], ({ raidInfoEnabled }) => {
    if (!raidInfoEnabled) return;

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
                            displayRaidInfo(node.querySelector('.raid-container .boss-name-container span').parentNode.firstChild.innerHTML);
                        }
                    });
                });
            });
            observer.observe(appContainer, { childList: true, subtree: true });
            clearInterval(uiExists);
        }
    }, 500);

    function displayRaidInfo(raidName) {
        const raidInfo = Object.values(raidData).find(r => r.name === raidName);
        console.log(raidInfo)
        const racesText = document.querySelector('.misc');
        racesText.style.whiteSpace = 'pre-line';
        racesText.textContent = `${raidInfo.races.join(", ")}\nweakness: ${raidInfo.weakness.join(", ")}\nresistance: ${raidInfo.resist.join(", ")}`;
    }
});