const data = {
    items: {},
    market: {},
    quest_zones: {},
    raids: {},
    recipes: {},
    formations: {}
};

chrome.storage.local.get("token", ({ token }) => {
    const fetchPromises = Object.keys(data).map(d =>
        fetch(`https://api.dragonsofthevoid.com/api/data/${d.replace("_", "-")}`, {
            headers: {
                authorization: token
            }
        })
            .then(r => r.json())
            .then(result => {
                data[d] = result;
            })
    );

    Promise.all(fetchPromises).then(() => {
        chrome.storage.local.set({ data: JSON.stringify(data) });
        console.log("Data stored in local storage");
    });
});
