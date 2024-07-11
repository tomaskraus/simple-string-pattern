"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nearley_1 = __importDefault(require("nearley"));
const ssp_ts_1 = __importDefault(require("#src/ssp-ts"));
const safe_string_literal_1 = require("safe-string-literal");
/**
 * encapsulates the SSP (simple string pattern) and provides
 * methods to create an SSP and test SSP against a string input.
 */
class SimpleStringPattern {
    /**
     * Creates a new SSP object.
     * @param pattern A string in SSP notation.
     */
    constructor(pattern) {
        this.parser = new nearley_1.default.Parser(nearley_1.default.Grammar.fromCompiled(ssp_ts_1.default));
        this.parser.feed(pattern);
        if (this.parser.results.length === 0) {
            throw new Error(`Parser: pattern not recognized: (${pattern})`);
        }
        const res = this.parser.results[0];
        // console.log('ssp parsed', res);
        this.pattern = res.value;
        this._body = (0, safe_string_literal_1.unescape)(res.body);
        switch (res.type) {
            case 'S':
                this._type = SimpleStringPattern.TYPE_START;
                break;
            case 'E':
                this._type = SimpleStringPattern.TYPE_END;
                break;
            case 'M':
                this._type = SimpleStringPattern.TYPE_MIDDLE;
                break;
            default:
                this._type = SimpleStringPattern.TYPE_FULL;
        }
    }
    /**
     *
     * @returns a simple string pattern
     */
    value() {
        return this.pattern;
    }
    /**
     *
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
        const escapedInput = (0, safe_string_literal_1.escape)(input, '\'"`');
        let dquotedInput = escapedInput;
        if (escapedInput.length > 1 &&
            escapedInput.startsWith('"') &&
            escapedInput.endsWith('"')) {
            dquotedInput = `"${escapedInput}"`;
        }
        else {
            dquotedInput = this._sanitizeBorderSpace(dquotedInput);
        }
        // console.log(`escaped: (${input}), (${escapedInput})`);
        return new this(dquotedInput);
    }
    static _sanitizeBorderSpace(str) {
        if (str.startsWith(' ') || str.endsWith(' ')) {
            return `"${str}"`;
        }
        return str;
    }
}
exports.default = SimpleStringPattern;
SimpleStringPattern.TYPE_FULL = 0b00;
SimpleStringPattern.TYPE_START = 0b10;
SimpleStringPattern.TYPE_END = 0b01;
SimpleStringPattern.TYPE_MIDDLE = 0b11;
(() => {
})();
