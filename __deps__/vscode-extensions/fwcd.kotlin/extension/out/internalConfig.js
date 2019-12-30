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
const fs = require("fs");
class InternalConfigManager {
    constructor(filePath, config) {
        this.filePath = filePath;
        this.config = config;
    }
    static loadingConfigFrom(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new InternalConfigManager(filePath, yield loadConfigFrom(filePath));
        });
    }
    getConfig() { return this.config; }
    updateConfig(changes) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(this.config, changes);
            yield saveConfigTo(this.filePath, this.config);
        });
    }
}
exports.InternalConfigManager = InternalConfigManager;
function loadConfigFrom(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return JSON.parse((yield fs.promises.readFile(filePath)).toString("utf8"));
        }
        catch (_a) {
            return { initialized: false };
        }
    });
}
function saveConfigTo(filePath, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.promises.writeFile(filePath, JSON.stringify(config), { encoding: "utf8" });
    });
}
//# sourceMappingURL=internalConfig.js.map