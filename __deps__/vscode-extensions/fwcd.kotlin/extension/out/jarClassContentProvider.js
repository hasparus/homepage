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
const lspExtensions_1 = require("./lspExtensions");
/**
 * Fetches the source contents of a class using
 * the language server.
 */
class JarClassContentProvider {
    constructor(client) {
        this.client = client;
    }
    setClient(client) {
        this.client = client;
    }
    provideTextDocumentContent(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.sendRequest(lspExtensions_1.JarClassContentsRequest.type, { uri: uri.toString() });
            if (result == null) {
                vscode.window.showErrorMessage(`Could not fetch class file contents of '${uri}' from the language server. Make sure that it conforms to the format 'kls:file:///path/to/myJar.jar!/path/to/myClass.class'!`);
                return "";
            }
            else {
                return result;
            }
        });
    }
}
exports.JarClassContentProvider = JarClassContentProvider;
//# sourceMappingURL=jarClassContentProvider.js.map