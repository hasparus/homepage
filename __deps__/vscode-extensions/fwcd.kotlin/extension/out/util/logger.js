"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["NONE"] = 100] = "NONE";
    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 0] = "INFO";
    LogLevel[LogLevel["DEBUG"] = -1] = "DEBUG";
    LogLevel[LogLevel["TRACE"] = -2] = "TRACE";
    LogLevel[LogLevel["DEEP_TRACE"] = -3] = "DEEP_TRACE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor(level) {
        this.level = level;
    }
    format(msg, placeholders) {
        let result = "";
        let i = 0;
        let placeholderIndex = 0;
        while (i < msg.length) {
            let c = msg.charAt(i);
            let next = msg.charAt(i + 1);
            if (c === '{' && next === '}') {
                result += placeholders[placeholderIndex];
                placeholderIndex++;
                i += 2;
            }
            else {
                result += c;
                i++;
            }
        }
        return result;
    }
    log(prefix, level, msg, placeholders) {
        if (level >= this.level) {
            console.log(prefix + this.format(msg, placeholders));
        }
    }
    error(msg, ...placeholders) { this.log("Extension: [ERROR]  ", LogLevel.ERROR, msg, placeholders); }
    warn(msg, ...placeholders) { this.log("Extension: [WARN]   ", LogLevel.WARN, msg, placeholders); }
    info(msg, ...placeholders) { this.log("Extension: [INFO]   ", LogLevel.INFO, msg, placeholders); }
    debug(msg, ...placeholders) { this.log("Extension: [DEBUG]  ", LogLevel.DEBUG, msg, placeholders); }
    trace(msg, ...placeholders) { this.log("Extension: [TRACE]  ", LogLevel.TRACE, msg, placeholders); }
    deepTrace(msg, ...placeholders) { this.log("Extension: [D_TRACE]", LogLevel.DEEP_TRACE, msg, placeholders); }
}
exports.Logger = Logger;
exports.LOG = new Logger(LogLevel.INFO);
//# sourceMappingURL=logger.js.map