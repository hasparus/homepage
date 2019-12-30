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
const vscode = require("vscode");
const path = require("path");
const child_process = require("child_process");
const serverDownloader_1 = require("./serverDownloader");
const osUtils_1 = require("./util/osUtils");
function registerDebugAdapter(context, status, customPath) {
    return __awaiter(this, void 0, void 0, function* () {
        status.update("Registering Kotlin Debug Adapter...");
        // Prepare debug adapter
        const debugAdapterInstallDir = path.join(context.globalStoragePath, "debugAdapterInstall");
        if (!customPath) {
            const debugAdapterDownloader = new serverDownloader_1.ServerDownloader("Kotlin Debug Adapter", "kotlin-debug-adapter", "adapter.zip", debugAdapterInstallDir);
            try {
                yield debugAdapterDownloader.downloadServerIfNeeded(status);
            }
            catch (error) {
                console.error(error);
                vscode.window.showWarningMessage(`Could not update/download Kotlin Debug Adapter: ${error}`);
                return;
            }
        }
        const startScriptPath = customPath || path.join(debugAdapterInstallDir, "adapter", "bin", osUtils_1.correctScriptName("kotlin-debug-adapter"));
        // Ensure that start script can be executed
        if (osUtils_1.isOSUnixoid()) {
            child_process.exec(`chmod +x ${startScriptPath}`);
        }
        vscode.debug.registerDebugAdapterDescriptorFactory("kotlin", new KotlinDebugAdapterDescriptorFactory(startScriptPath));
    });
}
exports.registerDebugAdapter = registerDebugAdapter;
/**
 * A factory that creates descriptors which point
 * to the Kotlin debug adapter start script.
 */
class KotlinDebugAdapterDescriptorFactory {
    constructor(startScriptPath) {
        this.startScriptPath = startScriptPath;
    }
    createDebugAdapterDescriptor(session, executable) {
        return __awaiter(this, void 0, void 0, function* () {
            return new vscode.DebugAdapterExecutable(this.startScriptPath);
        });
    }
}
exports.KotlinDebugAdapterDescriptorFactory = KotlinDebugAdapterDescriptorFactory;
//# sourceMappingURL=debugSetup.js.map