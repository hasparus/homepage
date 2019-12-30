"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const extractZipWithCallback = require("extract-zip");
const path = require("path");
const semver = require("semver");
const requestPromise = require("request-promise-native");
const fs = require("fs");
const util_1 = require("util");
const fsUtils_1 = require("./util/fsUtils");
const logger_1 = require("./util/logger");
const downloadUtils_1 = require("./util/downloadUtils");
const extractZip = util_1.promisify(extractZipWithCallback);
/**
 * Downloads language servers or debug adapters from GitHub releases.
 * The downloaded automatically manages versioning and downloads
 * updates if necessary.
 */
class ServerDownloader {
    constructor(displayName, githubProjectName, assetName, installDir) {
        this.displayName = displayName;
        this.githubProjectName = githubProjectName;
        this.installDir = installDir;
        this.assetName = assetName;
    }
    latestReleaseInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawJson = yield requestPromise.get(`https://api.github.com/repos/fwcd/${this.githubProjectName}/releases/latest`, {
                headers: { "User-Agent": "vscode-kotlin-ide" }
            });
            return JSON.parse(rawJson);
        });
    }
    serverInfoFile() {
        return path.join(this.installDir, "SERVER-INFO");
    }
    installedServerInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = JSON.parse((yield fs.promises.readFile(this.serverInfoFile())).toString("utf8"));
                return semver.valid(info.version) ? info : null;
            }
            catch (_a) {
                return null;
            }
        });
    }
    updateInstalledServerInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.promises.writeFile(this.serverInfoFile(), JSON.stringify(info), { encoding: "utf8" });
        });
    }
    downloadServer(downloadUrl, version, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield fsUtils_1.fsExists(this.installDir))) {
                yield fs.promises.mkdir(this.installDir, { recursive: true });
            }
            const downloadDest = path.join(this.installDir, `download-${this.assetName}`);
            status.update(`Downloading ${this.displayName} ${version}...`);
            yield downloadUtils_1.download(downloadUrl, downloadDest, percent => {
                status.update(`Downloading ${this.displayName} ${version} :: ${(percent * 100).toFixed(2)} %`);
            });
            status.update(`Unpacking ${this.displayName} ${version}...`);
            yield extractZip(downloadDest, { dir: this.installDir });
            yield fs.promises.unlink(downloadDest);
            status.update(`Initializing ${this.displayName}...`);
        });
    }
    downloadServerIfNeeded(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverInfo = yield this.installedServerInfo();
            const serverInfoOrDefault = serverInfo || { version: "0.0.0", lastUpdate: Number.MIN_SAFE_INTEGER };
            const secondsSinceLastUpdate = (Date.now() - serverInfoOrDefault.lastUpdate) / 1000;
            if (secondsSinceLastUpdate > 480) {
                // Only query GitHub API for latest version if some time has passed
                logger_1.LOG.info(`Querying GitHub API for new ${this.displayName} version...`);
                let releaseInfo;
                try {
                    releaseInfo = yield this.latestReleaseInfo();
                }
                catch (error) {
                    const message = `Could not fetch from GitHub releases API: ${error}.`;
                    if (serverInfo == null) {
                        // No server is installed yet, so throw
                        throw new Error(message);
                    }
                    else {
                        // Do not throw since user might just be offline
                        // and a version of the server is already installed
                        logger_1.LOG.warn(message);
                        return;
                    }
                }
                const latestVersion = releaseInfo.tag_name;
                const installedVersion = serverInfoOrDefault.version;
                const serverNeedsUpdate = semver.gt(latestVersion, installedVersion);
                let newVersion = installedVersion;
                if (serverNeedsUpdate) {
                    const serverAsset = releaseInfo.assets.find(asset => asset.name === this.assetName);
                    if (serverAsset) {
                        const downloadUrl = serverAsset.browser_download_url;
                        yield this.downloadServer(downloadUrl, latestVersion, status);
                    }
                    else {
                        throw new Error(`Latest GitHub release for ${this.githubProjectName} does not contain the asset '${this.assetName}'!`);
                    }
                    newVersion = latestVersion;
                }
                yield this.updateInstalledServerInfo({
                    version: newVersion,
                    lastUpdate: Date.now()
                });
            }
        });
    }
}
exports.ServerDownloader = ServerDownloader;
//# sourceMappingURL=serverDownloader.js.map