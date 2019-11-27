// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const download = require('electron-download');

download(
    {
        version: '7.1.1',
    },
    function(err, zipPath) {
        // zipPath will be the path of the zip that it downloaded.
        // If the zip was already cached it will skip
        // downloading and call the cb with the cached zip path.
        // If it wasn't cached it will download the zip and save
        // it in the cache path.
        console.log('######################pathDownload= ', zipPath);
    },
);
