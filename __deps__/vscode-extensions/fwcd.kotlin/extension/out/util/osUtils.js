"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isOSWindows() {
    return process.platform === "win32";
}
exports.isOSWindows = isOSWindows;
function isOSUnixoid() {
    let platform = process.platform;
    return platform === "linux"
        || platform === "darwin"
        || platform === "freebsd"
        || platform === "openbsd";
}
exports.isOSUnixoid = isOSUnixoid;
function correctBinname(binname) {
    return binname + ((process.platform === 'win32') ? '.exe' : '');
}
exports.correctBinname = correctBinname;
function correctScriptName(binname) {
    return binname + ((process.platform === 'win32') ? '.bat' : '');
}
exports.correctScriptName = correctScriptName;
//# sourceMappingURL=osUtils.js.map