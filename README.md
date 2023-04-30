# dotv helper

## Installation

To install dotv helper, follow these steps:

1. Download the extension files from the latest [release](https://github.com/MattiasKDev/dotv-helper/releases).
2. Open the Chrome browser and navigate to the [chrome://extensions](chrome://extensions) page.
3. Enable the "Developer mode" toggle in the top-right corner of the page.
4. Click the "Load unpacked" button in the top-left corner of the page.
5. Select the folder containing the extension files and click "Select."

## Features

### Item Location View
![item location view demo](https://i.imgur.com/sXw588Z.gif)

Adds a button in the top right that opens a small window. The window displays where to get the item that the mouse is currently hovered over.

#### How It Works

### planned features
 - collections: a new tab to see what obtainable items you are missing
 - loot tables: display loot tables for raids in game. Has been done by matrix [tampermonkey script](https://greasyfork.org/en/scripts/450685-dragons-of-the-void-raid-loot-tiers)

This feature works by utilizing content scripts to inject html on to the page. The information about item locations comes from [item_locations.json](https://github.com/MattiasKDev/dotv-helper/blob/main/item_locations.json). This data was created automatically in a different project using the games api.



If you have any issues or feedback, please contact me on discord @infinity#2020.

Thank you for using dotv helper!
