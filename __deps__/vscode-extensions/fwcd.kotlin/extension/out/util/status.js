"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/**
 * Encapsulates a status bar item.
 */
class StatusBarEntry {
    constructor(context, prefix) {
        this.prefix = prefix;
        this.barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        context.subscriptions.push(this.barItem);
    }
    show() {
        this.barItem.show();
    }
    update(msg) {
        this.barItem.text = `${this.prefix} ${msg}`;
    }
    dispose() {
        this.barItem.dispose();
    }
}
exports.StatusBarEntry = StatusBarEntry;
//# sourceMappingURL=status.js.map