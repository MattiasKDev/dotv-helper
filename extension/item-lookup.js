console.log('Content script loaded');

let item_locations_json;

fetch(chrome.runtime.getURL("item_locations.json"))
    .then(response => response.json())
    .then(data => {
        item_locations_json = data;
    });

var bellCheck = setInterval(function () {
    bell = document.querySelector("#app > div > div.app-container > div.dotv-header.header > div.details > div.details-content > div:nth-child(2) > div.notification-icon")
    if (bell) {
        clearInterval(bellCheck);
        main(bell);
    }
}, 500); // check for bell element every 500ms

function main(bell) {
    console.log('Main function called');
    icon = bell.cloneNode(true);
    bell.parentNode.appendChild(icon);
    icon.querySelector("img").src = "https://freeiconshop.com/wp-content/uploads/edd/book-open-outline-filled.png";


    const disp = document.createElement('div');
    disp.className = 'custom-container notification-menu';
    disp.setAttribute('data-v-403f701e', '');
    disp.setAttribute('data-v-aada2b62', '');
    disp.innerHTML = '<div class="background-image" data-v-403f701e="" style="background-image: url(&quot;https://api.dragonsofthevoid.com/images/textures/leather.jpg&quot;); background-size: cover; filter: brightness(0.8);"></div><div class="background-image image-border" data-v-403f701e="" style="border-image: url(&quot;https://api.dragonsofthevoid.com/images/frame/brass.png&quot;) 45% / 90px / 0 stretch;"></div>';

    const container = document.createElement('div');
    container.style.display = "flex";
    container.style.alignItems = "center";
    disp.appendChild(container);

    const imgDiv = document.createElement('div');
    imgDiv.id = 'item-image';
    imgDiv.style.display = 'inline';
    const img = document.createElement('img');
    img.style = "width: 100px; height: 100px;";
    imgDiv.appendChild(img);
    container.appendChild(imgDiv);

    const itemName = document.createElement('div');
    itemName.style = "display: inline; font-size: 24px; margin-left: 10px;";
    container.appendChild(itemName);

    const itemLocationsContainer = document.createElement('div');
    itemLocationsContainer.style = "height: 100%; overflow: auto;";
    disp.appendChild(itemLocationsContainer);
    const itemLocations = document.createElement('dl');
    itemLocationsContainer.appendChild(itemLocations);


    icon.querySelector("img").addEventListener("click", function (event) {
        console.log(event.target)
        console.log(icon.querySelector("img"))
        if (!icon.contains(disp)) {
            icon.appendChild(disp);
        }
        else {
            icon.removeChild(disp);
        }
    });


    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type !== 'childList') {
                continue;
            }

            if (mutation.addedNodes.length === 0) {
                continue;
            }

            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLDivElement && node.classList.contains('tooltip-content-container'))) {
                    continue;
                }

                itemN = node.querySelector('.item-popover-head-details span').textContent;
                img.src = node.querySelector('.item-popover-image-container img')?.getAttribute('src');
                itemName.textContent = itemN


                itemLocations.innerHTML = '';
                item = item_locations_json[itemN.toLowerCase()];
                if (item) {
                    if (!item['crafting'] && !item['market'] && (item['raids'].length + item['quests'].length) == 0) {
                        var dt = document.createElement("dt");
                        dt.innerText = "No locations found";
                        itemLocations.appendChild(dt);
                        break
                    }

                    if (item['crafting']) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Crafting";
                        itemLocations.appendChild(dt);
                    }
                    if (item['market']) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Market";
                        itemLocations.appendChild(dt);
                    }
                    if (item['raids'].length > 0) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Raids";
                        itemLocations.appendChild(dt);
                        for (raid in item['raids']) {
                            var dd = document.createElement("dd");
                            dd.innerText = item['raids'][raid];
                            itemLocations.appendChild(dd);
                        }
                    }
                    if (item['quests'].length > 0) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Quests";
                        itemLocations.appendChild(dt);
                        for (quest in item['quests']) {
                            var dd = document.createElement("dd");
                            dd.innerText = item['quests'][quest];
                            itemLocations.appendChild(dd);
                        }
                    }
                }
            }
        };
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });

}