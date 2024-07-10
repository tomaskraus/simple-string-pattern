"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nearley_1 = __importDefault(require("nearley"));
const ssp_1 = __importDefault(require("../.temp/ssp"));
// import jsStringEscape from 'js-string-escape';
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
        this.parser = new nearley_1.default.Parser(nearley_1.default.Grammar.fromCompiled(ssp_1.default));
        this.parser.feed(pattern);
        if (this.parser.results.length === 0) {
            throw new Error(`Parser: pattern not recognized: (${pattern})`);
        }
        const res = this.parser.results[0];
        // console.log('ssp parsed', res);
        this.pattern = res.value;
        this.body = (0, safe_string_literal_1.unescape)(res.body);
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
                return input.startsWith(this.body);
            case SimpleStringPattern.TYPE_END:
                return input.endsWith(this.body);
            case SimpleStringPattern.TYPE_MIDDLE:
                return input.includes(this.body);
            default:
                return this.body === input;
        }
    }
    static parse(input) {
        if (input.length === 0) {
            return new this('""');
        }
        const escapedInput = (0, safe_string_literal_1.escape)(input, '\'"\\`');
        let dquotedInput = escapedInput;
        if (escapedInput.length > 1 &&
            escapedInput.startsWith('"') &&
            escapedInput.endsWith('"')) {
            dquotedInput = `"${escapedInput}"`;
        }
        else if (escapedInput.startsWith(' ') || escapedInput.endsWith(' ')) {
            dquotedInput = `"${escapedInput}"`;
        }
        // console.log(`escaped: (${input}), (${escapedInput})`);
        return new this(dquotedInput);
    }
}
exports.default = SimpleStringPattern;
SimpleStringPattern.TYPE_FULL = 0b00;
SimpleStringPattern.TYPE_START = 0b10;
SimpleStringPattern.TYPE_END = 0b01;
SimpleStringPattern.TYPE_MIDDLE = 0b11;
(() => {
})();
