"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_string_pattern_1 = __importDefault(require("#src/simple-string-pattern"));
describe('Full Pattern: does not match', () => {
    test('Does not match differently cased otherwise equal string.', () => {
        const patt = new simple_string_pattern_1.default('abc');
        expect(patt.test('aBc')).toBeFalsy();
    });
    test('Does not match an empty string.', () => {
        const patt = new simple_string_pattern_1.default('abc');
        expect(patt.test('')).toBeFalsy();
    });
    test('Does not match shorter string than a pattern body.', () => {
        const patt = new simple_string_pattern_1.default('abc');
        expect(patt.test('ab')).toBeFalsy();
    });
    test('Does not match longer string than a pattern body.', () => {
        const patt = new simple_string_pattern_1.default('abc');
        expect(patt.test('abcd')).toBeFalsy();
    });
});
describe('Full Pattern: match', () => {
    test('Does match an equal string.', () => {
        const patt = new simple_string_pattern_1.default('abc');
        expect(patt.test('abc')).toBeTruthy();
    });
    test('Does match an empty string.', () => {
        const patt = new simple_string_pattern_1.default('""');
        expect(patt.test('')).toBeTruthy();
    });
    test('Does match normal and dotted strings.', () => {
        const patterns = [
            'Hello',
            'Hello World!',
            "That's a 😀!",
            'from 🌀, through emoticons: 😀, to extended symbols: 🫖',
            '(1 + 1) / 2 = ?',
            'きáéÜΔδ',
            '.',
            '..',
            '.. ..',
            '. .',
            '.Hello.',
            '..Hello..',
        ];
        patterns.forEach(s => {
            expect(new simple_string_pattern_1.default(s).test(s)).toBeTruthy();
        });
    });
    test('Does match escaped strings.', () => {
        const patterns = [
            ['\\\\', '\\'],
            ['Two line\\n text', 'Two line\n text'],
            ['\\" (\\\', \\") \\"', '" (\', ") "'],
            ['\\\\ escaped backslash: \\\\.', '\\ escaped backslash: \\.'],
            [
                'A literal form of newline escape sequence: \\\\n.',
                'A literal form of newline escape sequence: \\n.',
            ],
        ];
        patterns.forEach(([esc, unesc]) => {
            expect(new simple_string_pattern_1.default(esc).test(unesc)).toBeTruthy();
        });
    });
    test('Does match double-quoted strings correctly.', () => {
        const patterns = [
            ['That\'s "inside" it.', 'That\'s "inside" it.'],
            [
                '" leading and trailing spaces matter.  "',
                ' leading and trailing spaces matter.  ',
            ],
            ['""That\'s a "hit"!""', '"That\'s a "hit"!"'],
            ['"Double quote at the start.', '"Double quote at the start.'],
            ['Double quote at the end: "', 'Double quote at the end: "'],
        ];
        patterns.forEach(([dq, inp]) => {
            const patt = new simple_string_pattern_1.default(dq);
            expect(patt.test(inp)).toBeTruthy();
        });
    });
    test('If pattern value has its leading double quote escaped, does not act as an Exact Pattern.', () => {
        const patt = new simple_string_pattern_1.default('\\" hello"');
        expect(patt.test('" hello"')).toBeTruthy();
        const patt2 = new simple_string_pattern_1.default('" hello"');
        expect(patt2.test(' hello')).toBeTruthy();
    });
});
