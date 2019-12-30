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
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const logger_1 = require("./util/logger");
const osUtils_1 = require("./util/osUtils");
const serverDownloader_1 = require("./serverDownloader");
const fsUtils_1 = require("./util/fsUtils");
const jarClassContentProvider_1 = require("./jarClassContentProvider");
/** Downloads and starts the language server. */
function activateLanguageServer(context, status, customPath) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.LOG.info('Activating Kotlin Language Server...');
        status.update("Activating Kotlin Language Server...");
        // Prepare language server
        const langServerInstallDir = path.join(context.globalStoragePath, "langServerInstall");
        if (!customPath) {
            const langServerDownloader = new serverDownloader_1.ServerDownloader("Kotlin Language Server", "kotlin-language-server", "server.zip", langServerInstallDir);
            try {
                yield langServerDownloader.downloadServerIfNeeded(status);
            }
            catch (error) {
                console.error(error);
                vscode.window.showWarningMessage(`Could not update/download Kotlin Language Server: ${error}`);
                return;
            }
        }
        status.update("Initializing Kotlin Language Server...");
        const javaExecutablePath = yield findJavaExecutable('java');
        if (javaExecutablePath == null) {
            vscode.window.showErrorMessage("Couldn't locate java in $JAVA_HOME or $PATH");
            return;
        }
        const outputChannel = vscode.window.createOutputChannel("Kotlin");
        context.subscriptions.push(outputChannel);
        const startScriptPath = customPath || path.resolve(langServerInstallDir, "server", "bin", osUtils_1.correctScriptName("kotlin-language-server"));
        const options = { outputChannel, startScriptPath, args: [] };
        const languageClient = createLanguageClient(options);
        // Create the language client and start the client.
        let languageClientDisposable = languageClient.start();
        context.subscriptions.push(languageClientDisposable);
        // Register a content provider for the 'kls' scheme
        const contentProvider = new jarClassContentProvider_1.JarClassContentProvider(languageClient);
        context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider("kls", contentProvider));
        context.subscriptions.push(vscode.commands.registerCommand("kotlin.languageServer.restart", () => __awaiter(this, void 0, void 0, function* () {
            yield languageClient.stop();
            languageClientDisposable.dispose();
            outputChannel.appendLine("");
            outputChannel.appendLine(" === Language Server Restart ===");
            outputChannel.appendLine("");
            languageClientDisposable = languageClient.start();
            context.subscriptions.push(languageClientDisposable);
        })));
        yield languageClient.onReady();
    });
}
exports.activateLanguageServer = activateLanguageServer;
function createLanguageClient(options) {
    // Options to control the language client
    const clientOptions = {
        // Register the server for Kotlin documents
        documentSelector: [
            { language: 'kotlin', scheme: 'file' },
            { language: 'kotlin', scheme: 'kls' }
        ],
        synchronize: {
            // Synchronize the setting section 'kotlin' to the server
            // NOTE: this currently doesn't do anything
            configurationSection: 'kotlin',
            // Notify the server about file changes to 'javaconfig.json' files contain in the workspace
            // TODO this should be registered from the language server side
            fileEvents: [
                vscode.workspace.createFileSystemWatcher('**/*.kt'),
                vscode.workspace.createFileSystemWatcher('**/*.kts'),
                vscode.workspace.createFileSystemWatcher('**/pom.xml'),
                vscode.workspace.createFileSystemWatcher('**/build.gradle'),
                vscode.workspace.createFileSystemWatcher('**/settings.gradle')
            ]
        },
        outputChannel: options.outputChannel,
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never
    };
    // Ensure that start script can be executed
    if (osUtils_1.isOSUnixoid()) {
        child_process.exec(`chmod +x ${options.startScriptPath}`);
    }
    // Start the child java process
    const serverOptions = {
        command: options.startScriptPath,
        args: options.args,
        options: { cwd: vscode.workspace.rootPath }
    };
    logger_1.LOG.info("Creating client {} with args {}", options.startScriptPath, options.args.join(' '));
    return new vscode_languageclient_1.LanguageClient("kotlin", "Kotlin Language Server", serverOptions, clientOptions);
}
function configureLanguage() {
    // Source: https://github.com/Microsoft/vscode/blob/9d611d4dfd5a4a101b5201b8c9e21af97f06e7a7/extensions/typescript/src/typescriptMain.ts#L186
    // License: https://github.com/Microsoft/vscode/blob/9d611d4dfd5a4a101b5201b8c9e21af97f06e7a7/extensions/typescript/OSSREADME.json
    vscode.languages.setLanguageConfiguration("kotlin", {
        indentationRules: {
            // ^(.*\*/)?\s*\}.*$
            decreaseIndentPattern: /^(.*\*\/)?\s*\}.*$/,
            // ^.*\{[^}"']*$
            increaseIndentPattern: /^.*\{[^}"']*$/
        },
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        onEnterRules: [
            {
                // e.g. /** | */
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: { indentAction: vscode.IndentAction.IndentOutdent, appendText: ' * ' }
            },
            {
                // e.g. /** ...|
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                action: { indentAction: vscode.IndentAction.None, appendText: ' * ' }
            },
            {
                // e.g.  * ...|
                beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                action: { indentAction: vscode.IndentAction.None, appendText: '* ' }
            },
            {
                // e.g.  */|
                beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                action: { indentAction: vscode.IndentAction.None, removeText: 1 }
            },
            {
                // e.g.  *-----*/|
                beforeText: /^(\t|(\ \ ))*\ \*[^/]*\*\/\s*$/,
                action: { indentAction: vscode.IndentAction.None, removeText: 1 }
            }
        ]
    });
}
exports.configureLanguage = configureLanguage;
function findJavaExecutable(rawBinname) {
    return __awaiter(this, void 0, void 0, function* () {
        let binname = osUtils_1.correctBinname(rawBinname);
        // First search java.home setting
        let userJavaHome = vscode.workspace.getConfiguration('java').get('home');
        if (userJavaHome != null) {
            logger_1.LOG.debug("Looking for Java in java.home (settings): {}", userJavaHome);
            let candidate = yield findJavaExecutableInJavaHome(userJavaHome, binname);
            if (candidate != null)
                return candidate;
        }
        // Then search each JAVA_HOME
        let envJavaHome = process.env['JAVA_HOME'];
        if (envJavaHome) {
            logger_1.LOG.debug("Looking for Java in JAVA_HOME (environment variable): {}", envJavaHome);
            let candidate = yield findJavaExecutableInJavaHome(envJavaHome, binname);
            if (candidate != null)
                return candidate;
        }
        // Then search PATH parts
        if (process.env['PATH']) {
            logger_1.LOG.debug("Looking for Java in PATH");
            let pathparts = process.env['PATH'].split(path.delimiter);
            for (let i = 0; i < pathparts.length; i++) {
                let binpath = path.join(pathparts[i], binname);
                if (fs.existsSync(binpath)) {
                    return binpath;
                }
            }
        }
        // Else return the binary name directly (this will likely always fail downstream)
        logger_1.LOG.debug("Could not find Java, will try using binary name directly");
        return binname;
    });
}
function findJavaExecutableInJavaHome(javaHome, binname) {
    return __awaiter(this, void 0, void 0, function* () {
        let workspaces = javaHome.split(path.delimiter);
        for (let i = 0; i < workspaces.length; i++) {
            let binpath = path.join(workspaces[i], 'bin', binname);
            if (yield fsUtils_1.fsExists(binpath))
                return binpath;
        }
        return null;
    });
}
//# sourceMappingURL=languageSetup.js.map