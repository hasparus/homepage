module.exports =
    (function () {
        "use strict";
        function peg$subclass(child, parent) {
            function ctor() { this.constructor = child; }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
        }
        function peg$SyntaxError(message, expected, found, location) {
            this.message = message;
            this.expected = expected;
            this.found = found;
            this.location = location;
            this.name = "SyntaxError";
            if (typeof Error.captureStackTrace === "function") {
                Error.captureStackTrace(this, peg$SyntaxError);
            }
        }
        peg$subclass(peg$SyntaxError, Error);
        peg$SyntaxError.buildMessage = function (expected, found) {
            var DESCRIBE_EXPECTATION_FNS = {
                literal: function (expectation) {
                    return "\"" + literalEscape(expectation.text) + "\"";
                },
                "class": function (expectation) {
                    var escapedParts = "", i;
                    for (i = 0; i < expectation.parts.length; i++) {
                        escapedParts += expectation.parts[i] instanceof Array
                            ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                            : classEscape(expectation.parts[i]);
                    }
                    return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
                },
                any: function (expectation) {
                    return "any character";
                },
                end: function (expectation) {
                    return "end of input";
                },
                other: function (expectation) {
                    return expectation.description;
                }
            };
            function hex(ch) {
                return ch.charCodeAt(0).toString(16).toUpperCase();
            }
            function literalEscape(s) {
                return s
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"')
                    .replace(/\0/g, '\\0')
                    .replace(/\t/g, '\\t')
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r')
                    .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
                    .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
            }
            function classEscape(s) {
                return s
                    .replace(/\\/g, '\\\\')
                    .replace(/\]/g, '\\]')
                    .replace(/\^/g, '\\^')
                    .replace(/-/g, '\\-')
                    .replace(/\0/g, '\\0')
                    .replace(/\t/g, '\\t')
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r')
                    .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
                    .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
            }
            function describeExpectation(expectation) {
                return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
            }
            function describeExpected(expected) {
                var descriptions = new Array(expected.length), i, j;
                for (i = 0; i < expected.length; i++) {
                    descriptions[i] = describeExpectation(expected[i]);
                }
                descriptions.sort();
                if (descriptions.length > 0) {
                    for (i = 1, j = 1; i < descriptions.length; i++) {
                        if (descriptions[i - 1] !== descriptions[i]) {
                            descriptions[j] = descriptions[i];
                            j++;
                        }
                    }
                    descriptions.length = j;
                }
                switch (descriptions.length) {
                    case 1:
                        return descriptions[0];
                    case 2:
                        return descriptions[0] + " or " + descriptions[1];
                    default:
                        return descriptions.slice(0, -1).join(", ")
                            + ", or "
                            + descriptions[descriptions.length - 1];
                }
            }
            function describeFound(found) {
                return found ? "\"" + literalEscape(found) + "\"" : "end of input";
            }
            return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
        };
        function peg$parse(input, options) {
            options = options !== void 0 ? options : {};
            var peg$FAILED = {}, peg$startRuleFunctions = { msg: peg$parsemsg }, peg$startRuleFunction = peg$parsemsg, peg$c0 = ":", peg$c1 = peg$literalExpectation(":", false), peg$c2 = "=", peg$c3 = peg$literalExpectation("=", false), peg$c4 = function (name, type, value) { return { name: name, type: type.trim(), value: value }; }, peg$c5 = /^[A-Za-z_'`]/, peg$c6 = peg$classExpectation([["A", "Z"], ["a", "z"], "_", "'", "`"], false, false), peg$c7 = /^[A-Za-z_'.0-9]/, peg$c8 = peg$classExpectation([["A", "Z"], ["a", "z"], "_", "'", ".", ["0", "9"]], false, false), peg$c9 = "$", peg$c10 = peg$literalExpectation("$", false), peg$c11 = /^[0-9]/, peg$c12 = peg$classExpectation([["0", "9"]], false, false), peg$c13 = /^[^=]/, peg$c14 = peg$classExpectation(["="], true, false), peg$c15 = ",", peg$c16 = peg$literalExpectation(",", false), peg$c17 = function (head, tail) { var items = fixList1(head, tail); return items.length === 1 ? items[0] : { kind: 'tuple', items: items }; }, peg$c18 = "()", peg$c19 = peg$literalExpectation("()", false), peg$c20 = function () { return { kind: 'plain', value: '()' }; }, peg$c21 = "(", peg$c22 = peg$literalExpectation("(", false), peg$c23 = ")", peg$c24 = peg$literalExpectation(")", false), peg$c25 = function (value) { return value; }, peg$c26 = function (con, arg) { return { kind: 'con', con: con, arg: arg }; }, peg$c27 = "{", peg$c28 = peg$literalExpectation("{", false), peg$c29 = "}", peg$c30 = peg$literalExpectation("}", false), peg$c31 = function (list) { return { kind: 'record', items: fixList(list) }; }, peg$c32 = function (name, value) { return { name: name, value: value }; }, peg$c33 = ";", peg$c34 = peg$literalExpectation(";", false), peg$c35 = function (head, tail) { return fixList1(head, tail); }, peg$c36 = "[||]", peg$c37 = peg$literalExpectation("[||]", false), peg$c38 = function () { return { kind: 'array', items: [] }; }, peg$c39 = "[|", peg$c40 = peg$literalExpectation("[|", false), peg$c41 = "|]", peg$c42 = peg$literalExpectation("|]", false), peg$c43 = function (list) { return { kind: 'array', items: list }; }, peg$c44 = "[]", peg$c45 = peg$literalExpectation("[]", false), peg$c46 = "[", peg$c47 = peg$literalExpectation("[", false), peg$c48 = "]", peg$c49 = peg$literalExpectation("]", false), peg$c50 = function (list) { return { kind: 'list', items: list }; }, peg$c51 = "\"", peg$c52 = peg$literalExpectation("\"", false), peg$c53 = /^[^\\"]/, peg$c54 = peg$classExpectation(["\\", "\""], true, false), peg$c55 = "\\", peg$c56 = peg$literalExpectation("\\", false), peg$c57 = peg$anyExpectation(), peg$c58 = function (value) { return { kind: 'plain', value: value }; }, peg$c59 = "'", peg$c60 = peg$literalExpectation("'", false), peg$c61 = /^[^\\']/, peg$c62 = peg$classExpectation(["\\", "'"], true, false), peg$c63 = "\\'", peg$c64 = peg$literalExpectation("\\'", false), peg$c65 = /^[^']/, peg$c66 = peg$classExpectation(["'"], true, false), peg$c67 = /^[^{}[\](),;|]/, peg$c68 = peg$classExpectation(["{", "}", "[", "]", "(", ")", ",", ";", "|"], true, false), peg$c69 = function (value) { return { kind: 'plain', value: value }; }, peg$c70 = /^[ \t\r\n]/, peg$c71 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false), peg$c72 = function () { }, peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
            if ("startRule" in options) {
                if (!(options.startRule in peg$startRuleFunctions)) {
                    throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
                }
                peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
            }
            function text() {
                return input.substring(peg$savedPos, peg$currPos);
            }
            function location() {
                return peg$computeLocation(peg$savedPos, peg$currPos);
            }
            function expected(description, location) {
                location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
                throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
            }
            function error(message, location) {
                location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
                throw peg$buildSimpleError(message, location);
            }
            function peg$literalExpectation(text, ignoreCase) {
                return { type: "literal", text: text, ignoreCase: ignoreCase };
            }
            function peg$classExpectation(parts, inverted, ignoreCase) {
                return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
            }
            function peg$anyExpectation() {
                return { type: "any" };
            }
            function peg$endExpectation() {
                return { type: "end" };
            }
            function peg$otherExpectation(description) {
                return { type: "other", description: description };
            }
            function peg$computePosDetails(pos) {
                var details = peg$posDetailsCache[pos], p;
                if (details) {
                    return details;
                }
                else {
                    p = pos - 1;
                    while (!peg$posDetailsCache[p]) {
                        p--;
                    }
                    details = peg$posDetailsCache[p];
                    details = {
                        line: details.line,
                        column: details.column
                    };
                    while (p < pos) {
                        if (input.charCodeAt(p) === 10) {
                            details.line++;
                            details.column = 1;
                        }
                        else {
                            details.column++;
                        }
                        p++;
                    }
                    peg$posDetailsCache[pos] = details;
                    return details;
                }
            }
            function peg$computeLocation(startPos, endPos) {
                var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
                return {
                    start: {
                        offset: startPos,
                        line: startPosDetails.line,
                        column: startPosDetails.column
                    },
                    end: {
                        offset: endPos,
                        line: endPosDetails.line,
                        column: endPosDetails.column
                    }
                };
            }
            function peg$fail(expected) {
                if (peg$currPos < peg$maxFailPos) {
                    return;
                }
                if (peg$currPos > peg$maxFailPos) {
                    peg$maxFailPos = peg$currPos;
                    peg$maxFailExpected = [];
                }
                peg$maxFailExpected.push(expected);
            }
            function peg$buildSimpleError(message, location) {
                return new peg$SyntaxError(message, null, null, location);
            }
            function peg$buildStructuredError(expected, found, location) {
                return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
            }
            function peg$parsemsg() {
                var s0, s1, s2, s3, s4, s5, s6, s7;
                s0 = peg$currPos;
                s1 = peg$parserid();
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 58) {
                        s2 = peg$c0;
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c1);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parsetype();
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 61) {
                                    s5 = peg$c2;
                                    peg$currPos++;
                                }
                                else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c3);
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsetuple();
                                        if (s7 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c4(s1, s4, s7);
                                            s0 = s1;
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parserid() {
                var s0, s1, s2, s3, s4;
                s0 = peg$currPos;
                s1 = peg$currPos;
                if (peg$c5.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c6);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    if (peg$c7.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c8);
                        }
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        if (peg$c7.test(input.charAt(peg$currPos))) {
                            s4 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c8);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s2 = [s2, s3];
                        s1 = s2;
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 === peg$FAILED) {
                    s1 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 36) {
                        s2 = peg$c9;
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c10);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        if (peg$c11.test(input.charAt(peg$currPos))) {
                            s4 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c12);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                if (peg$c11.test(input.charAt(peg$currPos))) {
                                    s4 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                }
                                else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c12);
                                    }
                                }
                            }
                        }
                        else {
                            s3 = peg$FAILED;
                        }
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        }
                        else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                if (s1 !== peg$FAILED) {
                    s0 = input.substring(s0, peg$currPos);
                }
                else {
                    s0 = s1;
                }
                return s0;
            }
            function peg$parseid() {
                var s0, s1, s2, s3, s4;
                s0 = peg$currPos;
                s1 = peg$currPos;
                if (peg$c5.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c6);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    if (peg$c7.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c8);
                        }
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        if (peg$c7.test(input.charAt(peg$currPos))) {
                            s4 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c8);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s2 = [s2, s3];
                        s1 = s2;
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    s0 = input.substring(s0, peg$currPos);
                }
                else {
                    s0 = s1;
                }
                return s0;
            }
            function peg$parsetype() {
                var s0, s1, s2;
                s0 = peg$currPos;
                s1 = [];
                if (peg$c13.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c14);
                    }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c13.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c14);
                            }
                        }
                    }
                }
                else {
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    s0 = input.substring(s0, peg$currPos);
                }
                else {
                    s0 = s1;
                }
                return s0;
            }
            function peg$parsetuple() {
                var s0, s1, s2, s3, s4, s5, s6, s7;
                s0 = peg$currPos;
                s1 = peg$parseprimary();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s5 = peg$c15;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c16);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseprimary();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 44) {
                                s5 = peg$c15;
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c16);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseprimary();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c17(s1, s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parseunit() {
                var s0, s1;
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c18) {
                    s1 = peg$c18;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c19);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c20();
                }
                s0 = s1;
                return s0;
            }
            function peg$parseparen() {
                var s0, s1, s2, s3, s4, s5;
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 40) {
                    s1 = peg$c21;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c22);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsetuple();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                    s5 = peg$c23;
                                    peg$currPos++;
                                }
                                else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c24);
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c25(s3);
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parseprimary() {
                var s0;
                s0 = peg$parseunit();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseparen();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsestring();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsechar();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parsecon();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parserecord();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parsearray();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parselist();
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$parseplain();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return s0;
            }
            function peg$parsecon() {
                var s0, s1, s2, s3;
                s0 = peg$currPos;
                s1 = peg$parseid();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseprimary();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c26(s1, s3);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parserecord() {
                var s0, s1, s2, s3, s4, s5;
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 123) {
                    s1 = peg$c27;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c28);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsefield_list();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 125) {
                                    s5 = peg$c29;
                                    peg$currPos++;
                                }
                                else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c30);
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c31(s3);
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parsefield() {
                var s0, s1, s2, s3, s4, s5;
                s0 = peg$currPos;
                s1 = peg$parseid();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s3 = peg$c2;
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c3);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsetuple();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c32(s1, s5);
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parsefield_list() {
                var s0, s1, s2, s3, s4, s5, s6, s7;
                s0 = peg$currPos;
                s1 = peg$parsefield();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 59) {
                            s5 = peg$c33;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c34);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsefield();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 59) {
                                s5 = peg$c33;
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c34);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsefield();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c35(s1, s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parsearray() {
                var s0, s1, s2, s3, s4, s5;
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 4) === peg$c36) {
                    s1 = peg$c36;
                    peg$currPos += 4;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c37);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c38();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c39) {
                        s1 = peg$c39;
                        peg$currPos += 2;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c40);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsevalue_list();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c41) {
                                        s5 = peg$c41;
                                        peg$currPos += 2;
                                    }
                                    else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c42);
                                        }
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c43(s3);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                return s0;
            }
            function peg$parselist() {
                var s0, s1, s2, s3, s4, s5;
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c44) {
                    s1 = peg$c44;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c45);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c38();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 91) {
                        s1 = peg$c46;
                        peg$currPos++;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c47);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsevalue_list();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 93) {
                                        s5 = peg$c48;
                                        peg$currPos++;
                                    }
                                    else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c49);
                                        }
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c50(s3);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                return s0;
            }
            function peg$parsevalue_list() {
                var s0, s1, s2, s3, s4, s5, s6, s7;
                s0 = peg$currPos;
                s1 = peg$parsetuple();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 59) {
                            s5 = peg$c33;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c34);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsetuple();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parse_();
                        if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 59) {
                                s5 = peg$c33;
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c34);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsetuple();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c35(s1, s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                return s0;
            }
            function peg$parsestring() {
                var s0, s1, s2, s3, s4, s5, s6, s7;
                s0 = peg$currPos;
                s1 = peg$currPos;
                s2 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 34) {
                    s3 = peg$c51;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c52);
                    }
                }
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    if (peg$c53.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c54);
                        }
                    }
                    if (s5 === peg$FAILED) {
                        s5 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 92) {
                            s6 = peg$c55;
                            peg$currPos++;
                        }
                        else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c56);
                            }
                        }
                        if (s6 !== peg$FAILED) {
                            if (input.length > peg$currPos) {
                                s7 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s7 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c57);
                                }
                            }
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            }
                            else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c53.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c54);
                            }
                        }
                        if (s5 === peg$FAILED) {
                            s5 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 92) {
                                s6 = peg$c55;
                                peg$currPos++;
                            }
                            else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c56);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                if (input.length > peg$currPos) {
                                    s7 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c57);
                                    }
                                }
                                if (s7 !== peg$FAILED) {
                                    s6 = [s6, s7];
                                    s5 = s6;
                                }
                                else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 34) {
                            s5 = peg$c51;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c52);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s3 = [s3, s4, s5];
                            s2 = s3;
                        }
                        else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = input.substring(s1, peg$currPos);
                }
                else {
                    s1 = s2;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c58(s1);
                }
                s0 = s1;
                return s0;
            }
            function peg$parsechar() {
                var s0, s1, s2, s3, s4, s5, s6, s7;
                s0 = peg$currPos;
                s1 = peg$currPos;
                s2 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 39) {
                    s3 = peg$c59;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c60);
                    }
                }
                if (s3 !== peg$FAILED) {
                    if (peg$c61.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c62);
                        }
                    }
                    if (s4 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c63) {
                            s4 = peg$c63;
                            peg$currPos += 2;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c64);
                            }
                        }
                        if (s4 === peg$FAILED) {
                            s4 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 92) {
                                s5 = peg$c55;
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c56);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = [];
                                if (peg$c65.test(input.charAt(peg$currPos))) {
                                    s7 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c66);
                                    }
                                }
                                if (s7 !== peg$FAILED) {
                                    while (s7 !== peg$FAILED) {
                                        s6.push(s7);
                                        if (peg$c65.test(input.charAt(peg$currPos))) {
                                            s7 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        }
                                        else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c66);
                                            }
                                        }
                                    }
                                }
                                else {
                                    s6 = peg$FAILED;
                                }
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                }
                                else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 39) {
                            s5 = peg$c59;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c60);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s3 = [s3, s4, s5];
                            s2 = s3;
                        }
                        else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = input.substring(s1, peg$currPos);
                }
                else {
                    s1 = s2;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c58(s1);
                }
                s0 = s1;
                return s0;
            }
            function peg$parseplain() {
                var s0, s1, s2, s3;
                s0 = peg$currPos;
                s1 = peg$currPos;
                s2 = [];
                if (peg$c67.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c68);
                    }
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c67.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c68);
                            }
                        }
                    }
                }
                else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = input.substring(s1, peg$currPos);
                }
                else {
                    s1 = s2;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c69(s1);
                }
                s0 = s1;
                return s0;
            }
            function peg$parse_() {
                var s0, s1, s2, s3;
                s0 = peg$currPos;
                s1 = peg$currPos;
                s2 = [];
                if (peg$c70.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c71);
                    }
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    if (peg$c70.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c71);
                        }
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = input.substring(s1, peg$currPos);
                }
                else {
                    s1 = s2;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c72();
                }
                s0 = s1;
                return s0;
            }
            function fixList(list) {
                return list || [];
            }
            function fixList1(head, tail) {
                return [head].concat(tail.map(function (item) {
                    return item[3];
                }));
            }
            peg$result = peg$startRuleFunction();
            if (peg$result !== peg$FAILED && peg$currPos === input.length) {
                return peg$result;
            }
            else {
                if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                    peg$fail(peg$endExpectation());
                }
                throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
                    ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
                    : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
            }
        }
        return {
            SyntaxError: peg$SyntaxError,
            parse: peg$parse
        };
    })();
//# sourceMappingURL=eval_result_parser.js.map