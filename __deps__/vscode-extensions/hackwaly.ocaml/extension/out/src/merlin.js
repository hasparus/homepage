'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const readline = require('readline');
const utils_1 = require('./utils');
const log_1 = require('./log');
const noop = () => { };
class OCamlMerlinSession {
    constructor() {
        this._wait = Promise.resolve();
        this._rejectWait = noop;
        this._protocolVersion = 1;
        this.restart();
    }
    restart() {
        this._rejectWait();
        if (this._rl) {
            this._rl.close();
            this._rl = null;
        }
        if (this._cp) {
            this._cp.kill();
            this._cp = null;
        }
        this._wait = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let merlinPath = vscode.workspace.getConfiguration('ocaml').get('merlinPath');
            this._cp = yield utils_1.opamSpawn([merlinPath]);
            this._cp.on('exit', (code, signal) => {
                log_1.default(`OCamlmerlin exited with code ${code}, signal ${signal}`);
            });
            this._cp.stdout.setEncoding("utf-8");
            this._cp.stdin['setDefaultEncoding']("ascii");
            this._rl = readline.createInterface({
                input: this._cp.stdout,
                output: this._cp.stdin,
                terminal: false
            });
            resolve();
        }));
        this._wait = this.request(['protocol', 'version', 2]).then(([status, result]) => {
            if (status === 'return' && result.selected === 2) {
                this._protocolVersion = 2;
            }
        });
    }
    request(data) {
        let promise = this._wait.then(() => {
            return new Promise((resolve, reject) => {
                let cmd = JSON.stringify(data);
                cmd = cmd.replace(/[\u0100-\uffff]/g, c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4));
                log_1.default(`command to merlin: ${cmd}`);
                this._rl.question(cmd + '\n', (answer) => {
                    log_1.default(`response from merlin: ${answer}`);
                    resolve(JSON.parse(answer));
                });
                this._rejectWait = reject;
            });
        });
        this._wait = promise.then(() => {
            this._rejectWait = noop;
        }, (err) => {
            console.error(err);
            this._rejectWait = noop;
        });
        return promise;
    }
    syncBuffer(file, content, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request(['checkout', 'auto', file]);
            if (token.isCancellationRequested)
                return null;
            if (this._protocolVersion === 2) {
                yield this.request(['tell', 'start', 'end', content]);
            }
            else {
                yield this.request(['seek', 'exact', { line: 1, col: 0 }]);
                if (token.isCancellationRequested)
                    return null;
                yield this.request(['tell', 'source-eof', content]);
            }
        });
    }
    dispose() {
        this._rl.close();
        this._cp.kill();
    }
}
exports.OCamlMerlinSession = OCamlMerlinSession;
//# sourceMappingURL=merlin.js.map