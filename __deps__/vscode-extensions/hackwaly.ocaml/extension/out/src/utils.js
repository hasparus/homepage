"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const child_process = require('child_process');
const compareVersions = require('compare-versions');
let configuration = vscode.workspace.getConfiguration("ocaml");
let opamVersion = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
    let opamPath = configuration.get('opamPath');
    child_process.exec('opam --version', (err, stdout) => {
        if (err)
            return reject(err);
        resolve(stdout.trim());
    });
}));
function wrapOpamExec(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        let useOpamToResolve = configuration.get('useOpamToResolve');
        if (useOpamToResolve) {
            let opamPath = configuration.get('opamPath');
            let version = yield opamVersion;
            if (compareVersions(version, '2.0.0') < 0) {
                cmd = [opamPath, 'config', 'exec', '--', ...cmd];
            }
            else {
                cmd = [opamPath, 'exec', '--', ...cmd];
            }
        }
        return cmd;
    });
}
exports.wrapOpamExec = wrapOpamExec;
function opamSpawn(cmd, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        cmd = yield wrapOpamExec(cmd);
        return child_process.spawn(cmd[0], cmd.slice(1), opts);
    });
}
exports.opamSpawn = opamSpawn;
//# sourceMappingURL=utils.js.map