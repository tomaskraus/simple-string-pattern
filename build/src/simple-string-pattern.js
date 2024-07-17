"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const safe_string_literal_1 = require("safe-string-literal");
/**
 * Encapsulates the SSP (simple string pattern) and provides
 * methods to create an SSP and test SSP against a string input.
 */
class SimpleStringPattern {
    /**
     * Creates a new SSP object.
     * @param pattern A string in SSP notation.
     */
    constructor(pattern) {
        const prohibitedSpaceMsg = (pattStr) => `Pattern [${pattStr}]: No leading or trailing space allowed in a pattern. 
    If you want to keep those spaces, enclose the pattern body in double quotes (").`;
        if (SimpleStringPattern._hasLeadingOrTrailingSpaces(pattern)) {
            throw new Error(prohibitedSpaceMsg(pattern));
        }
        this.pattern = pattern;
        this._body = this.pattern;
        this._type = SimpleStringPattern.TYPE_FULL;
        if (pattern.startsWith('... ') && pattern.endsWith(' ...')) {
            this._type = SimpleStringPattern.TYPE_MIDDLE;
            this._body = pattern.slice(4, -4);
        }
        else if (pattern.endsWith(' ...')) {
            this._type = SimpleStringPattern.TYPE_START;
            this._body = pattern.slice(0, -4);
        }
        else if (pattern.startsWith('... ')) {
            this._type = SimpleStringPattern.TYPE_END;
            this._body = pattern.slice(4);
        }
        if (this._body.length === 0) {
            throw new Error(`Pattern [${pattern}]: Empty pattern body is not allowed. Use ("") in pattern body to express an empty pattern.`);
        }
        if (SimpleStringPattern._hasLeadingOrTrailingSpaces(this._body)) {
            throw new Error(prohibitedSpaceMsg(pattern));
        }
        SimpleStringPattern._checkForUnwantedChars(this._body);
        SimpleStringPattern._checkForUnwantedEscapes(this._body);
        SimpleStringPattern._checkForUnclosedEscapes(this._body);
        if (SimpleStringPattern._isEnclosedInDoubleQuotes(this._body)) {
            this._body = this._body.slice(1, -1);
        }
        this._body = (0, safe_string_literal_1.unescape)(this._body);
    }
    /**
     * Gets a pattern string of this object.
     * @returns a simple string pattern
     */
    value() {
        return this.pattern;
    }
    /**
     * Tests if this object does match the input string argument.
     * @param input a string to match
     * @returns true if this SPP object match that input. False otherwise.
     */
    test(input) {
        // console.log(`body: (${this.body}), input: (${input})`);
        switch (this._type) {
            case SimpleStringPattern.TYPE_START:
                return input.startsWith(this._body);
            case SimpleStringPattern.TYPE_END:
                return input.endsWith(this._body);
            case SimpleStringPattern.TYPE_MIDDLE:
                return input.includes(this._body);
            default:
                return this._body === input;
        }
    }
    /**
     * Returns at least "the-same-matching", new SSP object with its body length being less or equal the original object's one.
     * Value() of the SSP object returned can be of "Start Pattern" type.
     * @param maxPatternLength A maximum number of characters new SSP object should contain (unicode).
     *   Note that escape sequences (such as \n, \t, \\\\) count as one character.
     * @returns "The-same-matching" partial pattern if maxPattern length is lower than this SSP object body length.
     *   Returns a copy of original SSP object otherwise.
     * @throws Error if maxPatternLength is negative.
     * @throws Error if the SSP object pattern is either of End Pattern or Middle Pattern type.
     */
    limitPatternLen(maxPatternLength) {
        if (maxPatternLength < 0) {
            throw new Error(`maxPatternLength argument should not be negative, is (${maxPatternLength}).`);
        }
        if (this._type === SimpleStringPattern.TYPE_MIDDLE ||
            this._type === SimpleStringPattern.TYPE_END) {
            throw new Error(`Object pattern value (${this.value}) must be either of Full Pattern or Start Pattern.`);
        }
        // console.log('body: ', this._body);
        const pattChars = Array.from(this._body);
        if (pattChars.length <= maxPatternLength) {
            return new SimpleStringPattern(this.value());
        }
        const newPatternBody = pattChars.slice(0, maxPatternLength).join('');
        // console.log('sliced:', slicedChars);
        const fullPatt = SimpleStringPattern.parse(newPatternBody);
        return new SimpleStringPattern(fullPatt.value() + ' ...');
    }
    /**
     *
     * @param input Tries to create an SSP object from the input. That SSP does match that input.
     * @returns A new SSP object. Its value is always of a Full Pattern type.
     * @throws Error if cannot create a valid SSP object from the input.
     *
     */
    static parse(input) {
        if (input.length === 0) {
            return new this('""');
        }
        let escapedInput = (0, safe_string_literal_1.escape)(input, '\'"`');
        if (this._isEnclosedInDoubleQuotes(escapedInput)) {
            escapedInput = this._escapePatternSpecialMeaning(escapedInput); // escape the special meaning
        }
        else {
            escapedInput = this._sanitizeBorderSpace(escapedInput);
        }
        if (escapedInput.startsWith('... ') || escapedInput.endsWith(' ...')) {
            escapedInput = this._encloseInDoubleQuotes(escapedInput);
        }
        // console.log(`escaped: (${input}), (${escapedInput})`);
        return new this(escapedInput);
    }
    static _hasLeadingOrTrailingSpaces(str) {
        return str.startsWith(' ') || str.endsWith(' ');
    }
    static _sanitizeBorderSpace(str) {
        if (this._hasLeadingOrTrailingSpaces(str)) {
            return this._encloseInDoubleQuotes(str);
        }
        return str;
    }
    static _isEnclosedInDoubleQuotes(str) {
        return str.length > 1 && str.startsWith('"') && str.endsWith('"');
    }
    static _encloseInDoubleQuotes(str) {
        return `"${str}"`;
    }
    static _checkForUnwantedChars(str) {
        str.split('').forEach((ch, i) => {
            // ASCII nonprintables
            if (ch.charCodeAt(0) < 31) {
                throw new Error(`String [${str}]: contains prohibited character with code [${ch.charCodeAt(0)}] at position [${i}]`);
            }
        });
    }
    static _checkForUnwantedEscapes(str) {
        let escapeMode = false;
        str.split('').forEach((ch, i) => {
            if (escapeMode) {
                if (escapeMode && this.ALLOWED_ESCAPES.indexOf(ch) < 0) {
                    throw new Error(`String [${str}]: contains prohibited escape sequence [\\${ch}] at position [${i}]`);
                }
                escapeMode = false;
            }
            else if (ch === '\\') {
                escapeMode = true;
            }
        });
    }
    static _checkForUnclosedEscapes(str) {
        let escapeCount = 0;
        for (let i = str.length - 1; i >= 0; i--) {
            if (str.charAt(i) === '\\') {
                escapeCount++;
            }
            else {
                break;
            }
        }
        if (escapeCount % 2 !== 0) {
            throw new Error(`String [${str}]: has unclosed escapes.`);
        }
    }
    static _escapePatternSpecialMeaning(str) {
        return `\\${str}`;
    }
}
exports.default = SimpleStringPattern;
SimpleStringPattern.TYPE_FULL = 0b00;
SimpleStringPattern.TYPE_START = 0b10;
SimpleStringPattern.TYPE_END = 0b01;
SimpleStringPattern.TYPE_MIDDLE = 0b11;
SimpleStringPattern.ALLOWED_ESCAPES = '\\trnfb"\'';
(() => {
})();
