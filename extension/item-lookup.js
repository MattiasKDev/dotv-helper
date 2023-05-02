console.log('Content script loaded');

let auth = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjAxNDAwNDA0Q0I0QUIzMTJGNENFNDRGQzdFMTU0REU4IiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2ODI5ODk1MjUsImV4cCI6MTY4MzA3NTkyNSwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5kcmFnb25zb2Z0aGV2b2lkLmNvbSIsImF1ZCI6ImFwaTEiLCJjbGllbnRfaWQiOiJkb3R2Iiwic3ViIjoiMzJiODNjMjEtNjY0OS00ODc2LWE3NTQtNTRjZTQ0MjVjMTVkIiwiYXV0aF90aW1lIjoxNjgyOTg5NTI1LCJpZHAiOiJsb2NhbCIsInJvbGUiOiJkYXRhRXZlbnRSZWNvcmRzLnVzZXIiLCJ1c2VybmFtZSI6ImRyZWFtcy5zZW5kaW5nMGVAaWNsb3VkLmNvbSIsImp0aSI6IkY5MDE3Rjk4M0YzNzgyMzZFN0FFQTBCQUM4NkVBRTdDIiwic2lkIjoiNzk3OTJCRjE2RUQ1RjczQUFEM0Q3MEM2OTQyMERBOEIiLCJpYXQiOjE2ODI5ODk1MjUsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCIsImFwaTEucmVhZCIsImFwaTEud3JpdGUiXSwiYW1yIjpbInB3ZCJdfQ.AFV09squ4xrEyccAkeEj2ihTtwgEU8UhV_uhWIySHcazVP18Cvolly_0y4xGV54S7AFv8NCLyQ916_TPO-tYTXYv88LeRI5A0gKKgJws35Qm9vR4OgX2tL86PV0HTPslhUSCyYKCStj8kAG3KUAwmN2GN8JgHY-Bu6r_sAyHIkoLH8x0QQAJ_Sg1WyUhM79nEPa1geHGaKQuFfF9btP7EkUNX7BigZ6ub6B253lOJ_jB_gQ3V0wYN1r703vd1oLIWYUwEaTO7CSrPiOgly3GLaPnDtHdEUOpX13QvdMxsRTMx5kkX3PnhbZjoLTdlwaj9qkxc233XDxmrE-XcH1a8A"
async function GetItemLocations() {
    var itemLocations = {};
    let data = {
        "items": {},
        "market": {},
        "quest_zones": {},
        "raids": {},
        "recipes": {},
        "formations": {}
    };

    const fetchPromises = [];

    for (const d in data) {
        const fetchPromise = fetch("https://api.dragonsofthevoid.com/api/data/" + d.replace("_", "-"), {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": auth,
                "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://play.dragonsofthevoid.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(r => r.text()).then(result => {
            console.log(d + " data loaded");
            data[d] = JSON.parse(result);
        })
        fetchPromises.push(fetchPromise);
    }

    await Promise.all(fetchPromises);

    function getItemLocations(itemID, dm) {
        for (const raid of Object.values(dm.raids)) {
            const diffs = [];
            for (const difficulty of raid.difficulties) {
                for (const loot of difficulty.loot) {
                    if (loot.id.slice(2) !== itemID.slice(2)) {
                        continue;
                    }
                    let txtToAppend = difficulty.id
                        .split("-")
                        .map((word) => word[0].toUpperCase())
                        .join("");
                    if (["hidden", "summoner"].includes(loot.rarity)) {
                        txtToAppend += `(${loot.rarity})`;
                    }
                    diffs.push(txtToAppend);
                    break;
                }
            }
            if (diffs.length) {
                itemLocations[itemID.slice(2)].raids.push(
                    `${raid.name}(${diffs.join("/")})`
                );
                diffs.length = 0;
            }
        }

        for (const recipe of Object.values(dm.recipes)) {
            if (recipe.id.slice(2) === itemID.slice(2)) {
                itemLocations[itemID.slice(2)].crafting = true;
                break;
            }
        }

        for (const offer of dm.market.marketOffers) {
            if (offer.id.slice(2) === itemID.slice(2)) {
                itemLocations[itemID.slice(2)].market = true;
                break;
            }
        }

        for (const questZone of Object.values(dm.quest_zones)) {
            for (const segments of questZone.segments) {
                for (const node of segments.nodes) {
                    const diffs = [];
                    for (const difficulty of node.difficulty) {
                        for (const loot of difficulty.loot) {
                            if (loot.id === itemID) {
                                diffs.push(difficulty.name[0]);
                                break;
                            }
                        }
                        for (const loot of difficulty.alwaysDrop) {
                            if (loot === itemID) {
                                diffs.push(difficulty.name[0]);
                                break;
                            }
                        }
                    }
                    if (diffs.length) {
                        itemLocations[itemID.slice(2)].quests.push(
                            `${questZone.id.split("-").pop()}.${segments.id
                                .split("-")
                                .pop()}.${node.id.split("-").pop()}(${diffs.join("/")})`
                        );
                    }
                }
            }
        }
    }

    for (const [itemID, info] of Object.entries(data.items)) {
        itemLocations[itemID.slice(2)] = {
            name: info.name.toLowerCase(),
            crafting: false,
            raids: [],
            market: false,
            quests: [],
        };
        getItemLocations(itemID, data);
    }

    for (const [formationID, info] of Object.entries(data.formations)) {
        itemLocations[formationID.slice(2)] = {
            name: info.name.toLowerCase(),
            crafting: false,
            raids: [],
            market: false,
            quests: [],
        };
        getItemLocations(formationID, data);
    }

    // duplicate itemLocations but replace the key with the name value and remove the name value
    const itemsByName = {};
    for (const item of Object.values(itemLocations)) {
        const { name, ...rest } = item;
        itemsByName[name] = rest;
    }
    console.log(itemsByName)
    return itemsByName;
}

let item_locations_json;
var bellCheck = setInterval(async function () {
    bell = document.querySelector("#app > div > div.app-container > div.dotv-header.header > div.details > div.details-content > div:nth-child(2) > div.notification-icon")
    if (bell) {
        clearInterval(bellCheck);
        item_locations_json = await GetItemLocations()
        console.log(item_locations_json)
        main(bell);
    }
}, 500); // check for bell element every 500ms

function main(bell) {
    console.log()
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
                console.log(item_locations_json)
                item = item_locations_json[itemN.toLowerCase()];
                if (item) {
                    if (!item.crafting && !item.market && (item.raids.length + item.quests.length) == 0) {
                        var dt = document.createElement("dt");
                        dt.innerText = "No locations found";
                        itemLocations.appendChild(dt);
                        break
                    }

                    if (item.crafting) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Crafting";
                        itemLocations.appendChild(dt);
                    }
                    if (item.market) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Market";
                        itemLocations.appendChild(dt);
                    }
                    if (item.raids.length > 0) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Raids";
                        itemLocations.appendChild(dt);
                        for (const raid in item.raids) {
                            var dd = document.createElement("dd");
                            dd.innerText = item.raids[raid];
                            itemLocations.appendChild(dd);
                        }
                    }
                    if (item.quests.length > 0) {
                        var dt = document.createElement("dt");
                        dt.innerText = "Quests";
                        itemLocations.appendChild(dt);
                        for (const quest in item.quests) {
                            var dd = document.createElement("dd");
                            dd.innerText = item.quests[quest];
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