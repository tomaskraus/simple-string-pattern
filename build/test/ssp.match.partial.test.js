"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_string_pattern_1 = __importDefault(require("#src/simple-string-pattern"));
const test_utils_1 = __importDefault(require("./test-utils"));
describe('Partial Pattern: match', () => {
    test('Start Pattern,End Pattern and Middle Pattern do match corresponding inputs.', () => {
        const patterns = [
            ['Hello', 'Hello'],
            ["That's a 😀! きáéÜΔ", "That's a 😀! きáéÜΔ"],
            ['That\'s "inside" it.', 'That\'s "inside" it.'],
            [
                '" leading and trailing spaces matter.  "',
                ' leading and trailing spaces matter.  ',
            ],
            ['"Double quote at the start.', '"Double quote at the start.'],
            ['.', '.'],
            ['..', '..'],
            ['. .', '. .'],
            ['Two line\\n text', 'Two line\n text'],
            ['\\" (\\\', \\") \\"', '" (\', ") "'],
            ['\\\\ escaped backslash: \\\\.', '\\ escaped backslash: \\.'],
            [
                'A literal form of newline escape sequence: \\\\n.',
                'A literal form of newline escape sequence: \\n.',
            ],
        ];
        patterns.forEach(([pattStr, input]) => {
            [test_utils_1.default.toStartPatt, test_utils_1.default.toMiddlePatt].forEach(pattModfn => {
                const patt = new simple_string_pattern_1.default(pattModfn(pattStr));
                [test_utils_1.default.id, (s) => test_utils_1.default.addSuffix('aa', s)].forEach(inputModFn => {
                    expect(patt.test(inputModFn(input))).toBeTruthy();
                });
            });
            [test_utils_1.default.toEndPatt, test_utils_1.default.toMiddlePatt].forEach(pattModfn => {
                const patt = new simple_string_pattern_1.default(pattModfn(pattStr));
                [test_utils_1.default.id, (s) => test_utils_1.default.addPrefix('aa', s)].forEach(inputModFn => {
                    expect(patt.test(inputModFn(input))).toBeTruthy();
                });
            });
            const patt = new simple_string_pattern_1.default(test_utils_1.default.toMiddlePatt(pattStr));
            [
                test_utils_1.default.id,
                (s) => test_utils_1.default.addPrefix('aa', s),
                (s) => test_utils_1.default.addSuffix('aa', s),
                (s) => test_utils_1.default.addPrefix('aa', test_utils_1.default.addSuffix('aa', s)),
            ].forEach(inputModFn => {
                expect(patt.test(inputModFn(input))).toBeTruthy();
            });
        });
    });
});
describe('Partial Pattern: match empty string:', () => {
    test('A "" Partial Pattern does match an empty input.', () => {
        expect(new simple_string_pattern_1.default('... ""').test('')).toBeTruthy();
        expect(new simple_string_pattern_1.default('"" ...').test('')).toBeTruthy();
        expect(new simple_string_pattern_1.default('... "" ...').test('')).toBeTruthy();
    });
});
describe('Partial Pattern: no match:', () => {
    test('Non-empty Partial Pattern does not match an empty input.', () => {
        expect(new simple_string_pattern_1.default('... a').test('')).toBeFalsy();
        expect(new simple_string_pattern_1.default('a ...').test('')).toBeFalsy();
        expect(new simple_string_pattern_1.default('... a ...').test('')).toBeFalsy();
    });
    test('Non-empty Partial Pattern does not match a lesser input.', () => {
        expect(new simple_string_pattern_1.default('... abc').test('ab')).toBeFalsy();
        expect(new simple_string_pattern_1.default('abc ...').test('ab')).toBeFalsy();
        expect(new simple_string_pattern_1.default('... abc ...').test('ab')).toBeFalsy();
    });
});
