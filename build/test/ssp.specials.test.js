"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_string_pattern_1 = __importDefault(require("#src/simple-string-pattern"));
const test_utils_1 = __importDefault(require("./test-utils"));
describe('Pattern: specials', () => {
    test('value() invariants.', () => {
        [
            '""',
            'Hello',
            "That's a 😀! きáéÜΔ",
            'That\'s "inside" it.',
            '" leading and trailing spaces matter.  "',
            '"Double quote at the start.',
            '.',
            '..',
            '. .',
            'Two line\\n text',
            '\\" (\\\', \\") \\"',
            '\\\\ escaped backslash: \\\\.',
            'A literal form of newline escape sequence: \\\\n.',
        ].forEach(pattStr => {
            [test_utils_1.default.id, test_utils_1.default.toStartPatt, test_utils_1.default.toEndPatt, test_utils_1.default.toMiddlePatt].forEach(pattModfn => {
                const patt = new simple_string_pattern_1.default(pattModfn(pattStr));
                // console.log('pattV:', patt.value());
                expect(new simple_string_pattern_1.default(patt.value()).value() === patt.value()).toBeTruthy();
            });
        });
    });
});
