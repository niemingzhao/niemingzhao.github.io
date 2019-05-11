# qiniu-image-upload

An extension for chrome to upload images to qiniu cloud storage.

## Features

- Drag & Drop to Upload
- Copy & Paste to Upload
- Copy Link to Clipboard

## Installation

1. Download this project and unzip the `qiniu-image-upload.zip` file in `dist` folder.
2. In `chrome://extensions`, choose to load the unzipped folder with developer mode open.

## Supplements

Qiniu cloud storage launched a new Region called `华东-浙江2(cn-east-2)`, but the extension does not have a mechanism to add regions. Therefore, please follow the steps below to expand the support for the new region, and the same can be done for subsequent new regions.

1. Configure the extension according to your own usage, and select `华东` as the storage region.
2. Enter the upload mainpage and press F12 (or right-click on the page and select "Inspect element") to enter the DevTools interface.
3. Select the "Application" tab and enter "Storage/Local Storage/chrome-extension://" successively.
4. On the right side of the interface, find the key "region" and its value, and update the value with the new client-upload domain address (For `华东-浙江2(cn-east-2)`, the domain address is `https://upload-cn-east-2.qiniup.com`).
5. Close the DevTools interface and the upload mainpage. Then re-enter the upload mainpage and upload a picture for testing.

## Inspired

This project is inspired by <https://github.com/neal1991/image-host>.
