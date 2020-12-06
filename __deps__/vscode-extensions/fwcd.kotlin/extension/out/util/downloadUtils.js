
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const fs = require("fs");
const requestProgress = require("request-progress");
function download(srcUrl, destPath, progress) {
    return new Promise((resolve, reject) => {
        requestProgress(request.get(srcUrl))
            .on("progress", state => progress(state.percent))
            .on("complete", () => resolve())
            .on("error", err => reject(err))
            .pipe(fs.createWriteStream(destPath));
    });
}
exports.download = download;  
//# sourceMappingURL=downloadUtils.js.map
