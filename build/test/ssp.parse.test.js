"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_string_pattern_1 = __importDefault(require("#src/simple-string-pattern"));
describe('Parse: failures', () => {
    test('Does not accept a string containing those escape sequences that are not allowed.', () => {
        expect(() => simple_string_pattern_1.default.parse('\\ ')).toThrow();
        expect(() => simple_string_pattern_1.default.parse('a\\a')).toThrow();
        expect(() => simple_string_pattern_1.default.parse('\\')).toThrow(); //single backslash character
    });
});
describe('Parse: simple', () => {
    test('Parses an empty string', () => {
        expect(simple_string_pattern_1.default.parse('').value()).toEqual('""');
    });
    test('Parses strings with no specials (enclosing spaces and double quotes, escapes)', () => {
        ['hello', "That's a 😀! きáéÜΔ", 'a'].forEach(input => {
            expect(simple_string_pattern_1.default.parse(input).value()).toEqual(input);
        });
    });
});
describe('Parse: escapes', () => {
    test('Excludes backslash from being escaped.', () => {
        [
            ['\\\\', '\\\\'],
            ['c:\\\\windows\\\\system', 'c:\\\\windows\\\\system'],
        ].forEach(([input, expactedValue]) => {
            expect(simple_string_pattern_1.default.parse(input).value()).toEqual(expactedValue);
        });
    });
    test('Parse: Special chars in a string are escaped.', () => {
        [
            ['Hello \nWorld!', 'Hello \\nWorld!'],
            ['a \t \b\t b', 'a \\t \\b\\t b'],
        ].forEach(([input, expactedValue]) => {
            expect(simple_string_pattern_1.default.parse(input).value()).toEqual(expactedValue);
        });
    });
});
describe('Parse: leading and trailing spaces', () => {
    test('Makes an exact pattern if leading or trailing spaces are found.', () => {
        [
            [' abc', '" abc"'],
            ['abc ', '"abc "'],
            [' abc ', '" abc "'],
        ].forEach(([input, expactedValue]) => {
            expect(simple_string_pattern_1.default.parse(input).value()).toEqual(expactedValue);
        });
    });
    test('Makes an exact pattern if enclosing double-quotes are found.', () => {
        [
            ['abc"', 'abc"'],
            ['"abc', '"abc'],
            ['"abc"', '""abc""'],
            [' abc"', '" abc""'],
        ].forEach(([input, expactedValue]) => {
            expect(simple_string_pattern_1.default.parse(input).value()).toEqual(expactedValue);
        });
    });
});
