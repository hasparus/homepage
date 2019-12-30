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
const merlin_1 = require('./merlin');
const child_process = require('child_process');
const Path = require('path');
const Fs = require('fs');
const utils_1 = require('./utils');
let promisify = require('tiny-promisify');
let fsExists = (path) => new Promise((resolve) => {
    Fs.exists(path, resolve);
});
let fsWriteFile = promisify(Fs.writeFile);
let sleep = (duration) => new Promise((resolve) => {
    setTimeout(resolve, duration);
});
let getStream = require('get-stream');
let ocamlLang = { language: 'ocaml' };
let configuration = vscode.workspace.getConfiguration("ocaml");
let doOcpIndent = (document, token, range) => __awaiter(this, void 0, void 0, function* () {
    let code = document.getText();
    let ocpIndentPath = configuration.get('ocpIndentPath');
    let cmd = [ocpIndentPath];
    if (range) {
        cmd.push('--lines');
        cmd.push(`${range.start.line + 1}-${range.end.line + 1}`);
    }
    cmd.push('--numeric');
    let cp = yield utils_1.opamSpawn(cmd, {
        cwd: Path.dirname(document.fileName)
    });
    token.onCancellationRequested(() => {
        cp.disconnect();
    });
    cp.stdin.write(code);
    cp.stdin.end();
    let output = yield getStream(cp.stdout);
    cp.unref();
    if (token.isCancellationRequested)
        return null;
    let newIndents = output.trim().split(/\n/g).map((n) => +n);
    let oldIndents = code.split(/\n/g).map((line) => /^\s*/.exec(line)[0]);
    let edits = [];
    let beginLine = range ? range.start.line : 0;
    newIndents.forEach((indent, index) => {
        let line = beginLine + index;
        let oldIndent = oldIndents[line];
        let newIndent = ' '.repeat(indent);
        if (oldIndent !== newIndent) {
            edits.push(vscode.TextEdit.replace(new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, oldIndent.length)), newIndent));
        }
    });
    return edits;
});
let ocamlKeywords = 'and|as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|false|for|fun|function|functor|if|in|include|inherit|inherit!|initializer|lazy|let|match|method|method!|module|mutable|new|object|of|open|open!|or|private|rec|sig|struct|then|to|true|try|type|val|val!|virtual|when|while|with'.split('|');
function activate(context) {
    let session = new merlin_1.OCamlMerlinSession();
    let toVsPos = (pos) => {
        return new vscode.Position(pos.line - 1, pos.col);
    };
    let fromVsPos = (pos) => {
        return { line: pos.line + 1, col: pos.character };
    };
    let toVsRange = (start, end) => {
        return new vscode.Range(toVsPos(start), toVsPos(end));
    };
    context.subscriptions.push(vscode.languages.setLanguageConfiguration('ocaml', {
        indentationRules: {
            increaseIndentPattern: /^\s*(type|let)\s[^=]*=\s*$|\b(do|begin|struct|sig)\s*$/,
            decreaseIndentPattern: /\b(done|end)\s*$/,
        }
    }));
    context.subscriptions.push(session);
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(ocamlLang, {
        provideDocumentFormattingEdits(document, options, token) {
            return doOcpIndent(document, token);
        }
    }));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(ocamlLang, {
        provideDocumentRangeFormattingEdits(document, range, options, token) {
            return doOcpIndent(document, token, range);
        }
    }));
    context.subscriptions.push(vscode.languages.registerOnTypeFormattingEditProvider(ocamlLang, {
        provideOnTypeFormattingEdits(document, position, ch, options, token) {
            return __awaiter(this, void 0, void 0, function* () {
                let isEndAt = (word) => {
                    let wordRange = document.getWordRangeAtPosition(position);
                    return wordRange.end.isEqual(position) && document.getText(wordRange) === word;
                };
                if ((ch === 'd' && !isEndAt('end')) || (ch === 'e' && !isEndAt('done'))) {
                    return [];
                }
                return doOcpIndent(document, token);
            });
        }
    }, ';', '|', ')', ']', '}', 'd', 'e'));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(ocamlLang, {
        provideCompletionItems(document, position, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return new vscode.CompletionList(ocamlKeywords.map((keyword) => {
                    let completionItem = new vscode.CompletionItem(keyword);
                    completionItem.kind = vscode.CompletionItemKind.Keyword;
                    return completionItem;
                }));
            });
        }
    }));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(ocamlLang, {
        provideCompletionItems(document, position, token) {
            return __awaiter(this, void 0, void 0, function* () {
                let line = document.getText(new vscode.Range(new vscode.Position(position.line, 0), position));
                let match = /(?:[~?]?[A-Za-z_0-9'`.]+)$/.exec(line);
                let prefix = match && match[0] || '';
                yield session.syncBuffer(document.fileName, document.getText(), token);
                if (token.isCancellationRequested)
                    return null;
                let [status, result] = yield session.request(['complete', 'prefix', prefix, 'at', fromVsPos(position), 'with', 'doc']);
                if (token.isCancellationRequested)
                    return null;
                if (status !== 'return')
                    return;
                return new vscode.CompletionList(result.entries.map(({ name, kind, desc, info }) => {
                    let completionItem = new vscode.CompletionItem(name);
                    let toVsKind = (kind) => {
                        switch (kind.toLowerCase()) {
                            case "value": return vscode.CompletionItemKind.Value;
                            case "variant": return vscode.CompletionItemKind.Enum;
                            case "constructor": return vscode.CompletionItemKind.Constructor;
                            case "label": return vscode.CompletionItemKind.Field;
                            case "module": return vscode.CompletionItemKind.Module;
                            case "signature": return vscode.CompletionItemKind.Interface;
                            case "type": return vscode.CompletionItemKind.Class;
                            case "method": return vscode.CompletionItemKind.Function;
                            case "#": return vscode.CompletionItemKind.Method;
                            case "exn": return vscode.CompletionItemKind.Constructor;
                            case "class": return vscode.CompletionItemKind.Class;
                        }
                    };
                    completionItem.kind = toVsKind(kind);
                    completionItem.detail = desc;
                    completionItem.documentation = info;
                    if (prefix.startsWith('#') && name.startsWith(prefix)) {
                        completionItem.textEdit = new vscode.TextEdit(new vscode.Range(new vscode.Position(position.line, position.character - prefix.length), position), name);
                    }
                    return completionItem;
                }));
            });
        }
    }, '.', '#'));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(ocamlLang, {
        provideDefinition(document, position, token) {
            return __awaiter(this, void 0, void 0, function* () {
                yield session.syncBuffer(document.fileName, document.getText(), token);
                if (token.isCancellationRequested)
                    return null;
                let locate = (kind) => __awaiter(this, void 0, Promise, function* () {
                    let [status, result] = yield session.request(['locate', null, kind, 'at', fromVsPos(position)]);
                    if (token.isCancellationRequested)
                        return null;
                    if (status !== 'return' || typeof result === 'string') {
                        return null;
                    }
                    let uri = document.uri;
                    let { file, pos } = result;
                    if (file) {
                        uri = vscode.Uri.file(file);
                    }
                    return new vscode.Location(uri, toVsPos(pos));
                });
                let mlDef = yield locate('ml');
                let mliDef = yield locate('mli');
                let locs = [];
                if (mlDef && mliDef) {
                    if (mlDef.uri.toString() === mliDef.uri.toString() && mlDef.range.isEqual(mliDef.range)) {
                        locs = [mlDef];
                    }
                    else {
                        locs = [mliDef, mlDef];
                    }
                }
                else {
                    if (mliDef)
                        locs.push(mliDef);
                    if (mlDef)
                        locs.push(mlDef);
                }
                return locs;
            });
        }
    }));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ocamlLang, {
        provideDocumentSymbols(document, token) {
            return __awaiter(this, void 0, void 0, function* () {
                yield session.syncBuffer(document.fileName, document.getText(), token);
                if (token.isCancellationRequested)
                    return null;
                let [status, result] = yield session.request(['outline']);
                if (token.isCancellationRequested)
                    return null;
                if (status !== 'return')
                    return null;
                let symbols = [];
                let toVsKind = (kind) => {
                    switch (kind.toLowerCase()) {
                        case "value": return vscode.SymbolKind.Variable;
                        case "variant": return vscode.SymbolKind.Enum;
                        case "constructor": return vscode.SymbolKind.Constructor;
                        case "label": return vscode.SymbolKind.Field;
                        case "module": return vscode.SymbolKind.Module;
                        case "signature": return vscode.SymbolKind.Interface;
                        case "type": return vscode.SymbolKind.Class;
                        case "method": return vscode.SymbolKind.Function;
                        case "#": return vscode.SymbolKind.Method;
                        case "exn": return vscode.SymbolKind.Constructor;
                        case "class": return vscode.SymbolKind.Class;
                    }
                };
                let traverse = (nodes) => {
                    for (let { name, kind, start, end, children } of nodes) {
                        symbols.push(new vscode.SymbolInformation(name, toVsKind(kind), toVsRange(start, end)));
                        if (Array.isArray(children)) {
                            traverse(children);
                        }
                    }
                };
                traverse(result);
                return symbols;
            });
        }
    }));
    context.subscriptions.push(vscode.languages.registerHoverProvider(ocamlLang, {
        provideHover(document, position, token) {
            return __awaiter(this, void 0, void 0, function* () {
                yield session.syncBuffer(document.fileName, document.getText(), token);
                if (token.isCancellationRequested)
                    return null;
                let [status, result] = yield session.request(['type', 'enclosing', 'at', fromVsPos(position)]);
                if (token.isCancellationRequested)
                    return null;
                if (status !== 'return' || result.length <= 0)
                    return;
                let { start, end, type } = result[0];
                // Try expand type
                if (/^[A-Za-z_0-9']+$/.test(type)) {
                    let [status, result] = yield session.request(['type', 'enclosing', 'at', fromVsPos(position)]);
                    if (token.isCancellationRequested)
                        return null;
                    if (!(status !== 'return' || result.length <= 0)) {
                        start = result[0].start;
                        end = result[0].end;
                        type = result[0].type;
                    }
                }
                // Since vscode shows scrollbar in hovertip. We don't need to truncate it ever.
                /*   if (type.includes('\n')) {
                      let lines = type.split(/\n/g);
                      if (lines.length > 6) {
                          let end = lines.pop();
                          lines = lines.slice(0, 5);
                          lines.push('  (* ... *)');
                          lines.push(end);
                      }
                      type = lines.join('\n');
                  } */
                if (/^sig\b/.test(type)) {
                    type = `module type _ = ${type}`;
                }
                else if (!/^type\b/.test(type)) {
                    type = `type _ = ${type}`;
                }
                return new vscode.Hover({ language: 'ocaml', value: type }, toVsRange(start, end));
            });
        }
    }));
    context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider(ocamlLang, {
        provideDocumentHighlights(document, position, token) {
            return __awaiter(this, void 0, void 0, function* () {
                yield session.syncBuffer(document.fileName, document.getText(), token);
                if (token.isCancellationRequested)
                    return null;
                let [status, result] = yield session.request(['occurrences', 'ident', 'at', fromVsPos(position)]);
                if (token.isCancellationRequested)
                    return null;
                if (status !== 'return' || result.length <= 0)
                    return;
                return result.map((item) => {
                    return new vscode.DocumentHighlight(toVsRange(item.start, item.end));
                });
            });
        }
    }));
    context.subscriptions.push(vscode.languages.registerRenameProvider(ocamlLang, {
        provideRenameEdits(document, position, newName, token) {
            return __awaiter(this, void 0, void 0, function* () {
                yield session.syncBuffer(document.fileName, document.getText(), token);
                if (token.isCancellationRequested)
                    return null;
                let [status, result] = yield session.request(['occurrences', 'ident', 'at', fromVsPos(position)]);
                if (token.isCancellationRequested)
                    return null;
                if (status !== 'return' || result.length <= 0)
                    return;
                let edits = result.map((item) => {
                    return new vscode.TextEdit(toVsRange(item.start, item.end), newName);
                });
                let edit = new vscode.WorkspaceEdit();
                edit.set(document.uri, edits);
                return edit;
            });
        }
    }));
    context.subscriptions.push(vscode.languages.registerReferenceProvider(ocamlLang, {
        provideReferences(document, position, context, token) {
            return __awaiter(this, void 0, void 0, function* () {
                yield session.syncBuffer(document.fileName, document.getText(), token);
                if (token.isCancellationRequested)
                    return null;
                let [status, result] = yield session.request(['occurrences', 'ident', 'at', fromVsPos(position)]);
                if (token.isCancellationRequested)
                    return null;
                if (status !== 'return' || result.length <= 0)
                    return;
                return result.map((item) => {
                    return new vscode.Location(document.uri, toVsRange(item.start, item.end));
                });
            });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('ocaml.switch_mli_ml', () => __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let doc = editor != null ? editor.document : null;
        let path = doc != null ? doc.fileName : null;
        let ext = Path.extname(path || '');
        let newExt = { '.mli': '.ml', '.ml': '.mli' }[ext];
        if (!newExt) {
            vscode.window.showInformationMessage('Target file must be an OCaml signature or implementation file');
            return;
        }
        let newPath = path.substring(0, path.length - ext.length) + newExt;
        if (!(yield fsExists(newPath))) {
            let name = { '.mli': 'Signature', '.ml': 'Implementation' }[newExt];
            let result = yield vscode.window.showInformationMessage(`${name} file doesn't exist.`, 'Create It');
            if (result === 'Create It') {
                yield fsWriteFile(newPath, '');
            }
            else {
                return;
            }
        }
        yield vscode.commands.executeCommand('vscode.open', vscode.Uri.file(newPath));
    })));
    let replTerm;
    context.subscriptions.push(vscode.window.onDidCloseTerminal((term) => {
        if (term === replTerm) {
            replTerm = null;
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('ocaml.repl', () => __awaiter(this, void 0, void 0, function* () {
        if (replTerm) {
            replTerm.dispose();
            replTerm = null;
        }
        yield checkREPL();
        replTerm.show();
    })));
    context.subscriptions.push(vscode.commands.registerCommand('ocaml.repl_send', () => __awaiter(this, void 0, void 0, function* () {
        yield checkREPL();
        replTerm.show(!configuration.get('replFocus', false));
        let editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        let selection = editor.document.getText(editor.selection);
        replTerm.sendText(selection, configuration.get('replNewline', true));
    })));
    context.subscriptions.push(vscode.commands.registerCommand('ocaml.repl_send_all', () => __awaiter(this, void 0, void 0, function* () {
        yield checkREPL();
        replTerm.show(!configuration.get('replFocus', false));
        let editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        let selection = editor.document.getText();
        replTerm.sendText(selection, configuration.get('replNewline', true));
    })));
    function suffix() {
        if (/^win/.test(process.platform)) {
            return 'windows';
        }
        return 'unix';
    }
    function checkREPL() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!replTerm) {
                let path = configuration.get('replPath' + '.' + suffix(), 'ocaml');
                replTerm = vscode.window.createTerminal('OCaml REPL', path);
            }
        });
    }
    context.subscriptions.push(vscode.commands.registerCommand('ocaml.repl_send_stmt', () => __awaiter(this, void 0, void 0, function* () {
        yield checkREPL();
        replTerm.show(!configuration.get('replFocus', false));
        let editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        let selection = editor.document.getText(editor.selection);
        if (!/;;\s*$/.test(selection)) {
            selection += ';;';
        }
        replTerm.sendText(selection, configuration.get('replNewline', true));
    })));
    context.subscriptions.push(vscode.commands.registerCommand('ocaml.restart_merlin', () => __awaiter(this, void 0, void 0, function* () {
        session.restart();
    })));
    context.subscriptions.push(vscode.commands.registerCommand('ocaml.opam_switch', () => __awaiter(this, void 0, void 0, function* () {
        let opamPath = configuration.get('opamPath');
        let result = yield new Promise((resolve, reject) => {
            child_process.exec(`${opamPath} switch list --all`, (err, stdout) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(stdout);
                }
            });
        });
        let lines = result.split(/\r?\n|\r/g);
        lines = lines.filter((line) => !!line);
        let items = lines.map((line) => {
            let match = /^(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/.exec(line);
            return {
                A: match[1],
                B: match[2],
                C: match[3],
                D: match[4],
            };
        }).filter((item) => {
            return item.A !== '--';
        }).map((item) => {
            let desc = item.B === 'C' ? 'Current' : '';
            return {
                label: item.A,
                description: desc,
                detail: item.D,
            };
        });
        let item = yield vscode.window.showQuickPick(items, {
            placeHolder: 'Select Opam Switch'
        });
        child_process.exec(`${opamPath} switch ${item.label}`, (err, stdout) => {
            if (err) {
                vscode.window.showErrorMessage(err.toString());
            }
            else if (stdout) {
                vscode.window.showInformationMessage(stdout.replace(/\r?\n|\r/g, ' '));
            }
        });
    })));
    let provideLinter = (document, token) => __awaiter(this, void 0, void 0, function* () {
        yield session.syncBuffer(document.fileName, document.getText(), token);
        if (token.isCancellationRequested)
            return null;
        let [status, result] = yield session.request(['errors']);
        if (token.isCancellationRequested)
            return null;
        if (status !== 'return')
            return;
        let diagnostics = [];
        result.map(({ type, start, end, message }) => {
            let fromType = (type) => {
                switch (type) {
                    case 'type':
                    case "parser":
                    case "env":
                    case "unknown":
                        return vscode.DiagnosticSeverity.Error;
                    case "warning":
                        return vscode.DiagnosticSeverity.Warning;
                }
            };
            if (type === 'type' &&
                message.startsWith('Error: Signature mismatch:') &&
                message.includes(': Actual declaration')) {
                let regex = /^\s*File ("[^"]+"), line (\d+), characters (\d+)-(\d+): Actual declaration$/mg;
                for (let match; (match = regex.exec(message)) !== null;) {
                    let file = JSON.parse(match[1]);
                    let line = JSON.parse(match[2]);
                    let col1 = JSON.parse(match[3]);
                    let col2 = JSON.parse(match[4]);
                    if (Path.basename(file) === Path.basename(document.fileName)) {
                        let diag = new vscode.Diagnostic(toVsRange({ line: line, col: col1 }, { line: line, col: col2 }), message, fromType(type.toLowerCase()));
                        diag.source = 'merlin';
                        diagnostics.push(diag);
                    }
                    else {
                    }
                }
                return;
            }
            let diag = new vscode.Diagnostic(toVsRange(start || 0, end || 0), message, fromType(type.toLowerCase()));
            diag.source = 'merlin';
            diagnostics.push(diag);
        });
        return diagnostics;
    });
    let LINTER_DEBOUNCE_TIMER = new WeakMap();
    let LINTER_TOKEN_SOURCE = new WeakMap();
    let LINTER_CLEAR_LISTENER = new WeakMap();
    let diagnosticCollection = vscode.languages.createDiagnosticCollection('merlin');
    let lintDocument = (document) => {
        if (document.languageId !== 'ocaml')
            return;
        clearTimeout(LINTER_DEBOUNCE_TIMER.get(document));
        LINTER_DEBOUNCE_TIMER.set(document, setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (LINTER_TOKEN_SOURCE.has(document)) {
                LINTER_TOKEN_SOURCE.get(document).cancel();
            }
            LINTER_TOKEN_SOURCE.set(document, new vscode.CancellationTokenSource());
            let diagnostics = yield provideLinter(document, LINTER_TOKEN_SOURCE.get(document).token);
            diagnosticCollection.set(document.uri, diagnostics);
        }), configuration.get('lintDelay')));
    };
    vscode.workspace.onDidSaveTextDocument((document) => __awaiter(this, void 0, void 0, function* () {
        if (!configuration.get('lintOnSave'))
            return;
        let diagnostics = yield provideLinter(document, new vscode.CancellationTokenSource().token);
        diagnosticCollection.set(document.uri, diagnostics);
    }));
    vscode.workspace.onDidChangeTextDocument(({ document }) => {
        if (!configuration.get('lintOnChange'))
            return;
        if (document.languageId === 'ocaml') {
            lintDocument(document);
            return;
        }
        let relintOpenedDocuments = () => {
            diagnosticCollection.clear();
            for (let document of vscode.workspace.textDocuments) {
                if (document.languageId === 'ocaml') {
                    lintDocument(document);
                }
            }
        };
        let path = Path.basename(document.fileName);
        if (path === '.merlin') {
            relintOpenedDocuments();
        }
    });
    vscode.workspace.onDidCloseTextDocument((document) => {
        if (document.languageId === 'ocaml') {
            diagnosticCollection.delete(document.uri);
        }
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map