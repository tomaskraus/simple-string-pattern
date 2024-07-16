"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_string_pattern_1 = __importDefault(require("#src/simple-string-pattern"));
describe('Full Pattern: constructor errors', () => {
    test('Does not accept an empty string.', () => {
        expect(() => new simple_string_pattern_1.default('')).toThrow();
    });
    test('Does not accept a string which starts and/or ends with space ( ).', () => {
        ['a ', ' a', ' a ', ' ', 'ab ', ' ab', ' ab ', '  a b '].forEach(s => {
            expect(() => new simple_string_pattern_1.default(s)).toThrow();
        });
    });
    test('Does not accept strings that contain unescaped control chars.', () => {
        const tabStr = String.fromCharCode(9);
        expect(() => new simple_string_pattern_1.default(tabStr)).toThrow();
        const unescapedMultilineStr = 'a\nb';
        expect(() => new simple_string_pattern_1.default(unescapedMultilineStr)).toThrow();
    });
    test('Does not accept a string containing those escape sequences that are not allowed.', () => {
        expect(() => new simple_string_pattern_1.default('\\ ')).toThrow();
        expect(() => new simple_string_pattern_1.default('a\\a')).toThrow();
    });
    test('Does not accept a string that ends with single backslash character.', () => {
        expect(() => new simple_string_pattern_1.default('\\')).toThrow();
        expect(() => new simple_string_pattern_1.default(' \\')).toThrow();
        expect(() => new simple_string_pattern_1.default('hello\\')).toThrow();
    });
    test('Does not accept a string that ends with odd number of consecutive backslash characters.', () => {
        expect(() => new simple_string_pattern_1.default('a\\')).toThrow();
        expect(() => new simple_string_pattern_1.default('a\\\\\\')).toThrow();
        expect(() => new simple_string_pattern_1.default('\\\\\\')).toThrow();
        expect(() => new simple_string_pattern_1.default('\\ta\\\\\\')).toThrow();
    });
});
// ----------------------------------------------------------------------------
describe('Full Pattern: constructor and getters - single character', () => {
    test('Does allow one character (ascii)', () => {
        const patt = new simple_string_pattern_1.default('a');
        expect(patt.value()).toEqual('a');
    });
    test('Does allow one character (non-ascii)', () => {
        const patt = new simple_string_pattern_1.default('き');
        expect(patt.value()).toEqual('き');
    });
    test('Does allow one character (emoji)', () => {
        const patt = new simple_string_pattern_1.default('😀');
        expect(patt.value()).toEqual('😀');
    });
    test('Does allow a dot character (.)', () => {
        const patt = new simple_string_pattern_1.default('.');
        expect(patt.value()).toEqual('.');
    });
    test('Does allow a double-quote character (")', () => {
        const patt = new simple_string_pattern_1.default('"');
        expect(patt.value()).toEqual('"');
    });
});
describe('Full Pattern: constructor and getters - multiple characters', () => {
    test('Does allow empty value by passing a string that contains two double-quotes.', () => {
        const patt = new simple_string_pattern_1.default('""');
        expect(patt.value()).toEqual('""');
    });
    test('Does allow normal strings, without leading and trailing spaces', () => {
        [
            'Hello',
            'Hello World!',
            "That's a 😀!",
            'from 🌀, through emoticons: 😀, to extended symbols: 🫖',
            '(1 + 1) / 2 = ?',
            'きáéÜΔδ',
        ].forEach(s => {
            const patt = new simple_string_pattern_1.default(s);
            expect(patt.value()).toEqual(s);
        });
    });
    test('Does allow string with dots at the start and/or end, still being in a pattern body', () => {
        ['.', '..', '.. ..', '. .', '.Hello.', '..Hello..'].forEach(s => {
            const patt = new simple_string_pattern_1.default(s);
            expect(patt.value()).toEqual(s);
        });
    });
    test('Does allow string with double quotes', () => {
        [
            'That\'s "inside" it.',
            '" Double quotes ensure that leading and trailing spaces matter in the matching process.  "',
            '""That\'s a "hit"!""',
            'Double quote at the end: "',
            '"Double quote at the start.',
        ].forEach(s => {
            const patt = new simple_string_pattern_1.default(s);
            expect(patt.value()).toEqual(s);
        });
    });
});
describe('Full Pattern: constructor and getters - escape sequences', () => {
    test('Does allow escaped common control ASCII character.', () => {
        ['\\', 't', 'r', 'n', 'f', 'b', '"', "'"].forEach(val => {
            const s = `\\${val}`;
            const patt = new simple_string_pattern_1.default(s);
            expect(patt.value()).toEqual(s);
        });
    });
    test('Does allow escapes in a text.', () => {
        [
            'Two line\\n text',
            '\\" (\\\', \\") \\"',
            '\\\\ escaped backslash: \\\\.',
            'A literal form of newline escape sequence: \\\\n.',
        ].forEach(s => {
            const patt = new simple_string_pattern_1.default(s);
            expect(patt.value()).toEqual(s);
        });
    });
});
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
describe('Partial Pattern: constructor errors', () => {
    test('Does not accept an "empty-matching" Start Pattern without implicit "".', () => {
        expect(() => new simple_string_pattern_1.default(' ...')).toThrow();
    });
    test('Does not accept an "empty-matching" End Pattern without implicit "".', () => {
        expect(() => new simple_string_pattern_1.default('... ')).toThrow();
    });
    test('Does not accept an "empty-matching" Middle Pattern without implicit "".', () => {
        expect(() => new simple_string_pattern_1.default('...  ...')).toThrow();
    });
    test('Does not accept a string which starts and/or ends with space ( ).', () => {
        ['a ', ' a', ' a ', ' ', 'ab ', ' ab', ' ab ', '  a b '].forEach(s => {
            expect(() => new simple_string_pattern_1.default(s)).toThrow();
        });
    });
    test('Does not accept strings that contain unescaped control chars.', () => {
        const tabStr = String.fromCharCode(9);
        expect(() => new simple_string_pattern_1.default('... ' + tabStr)).toThrow();
        const unescapedMultilineStr = 'a\nb';
        expect(() => new simple_string_pattern_1.default(unescapedMultilineStr + ' ...')).toThrow();
    });
    test('Does not accept a string containing those escape sequences that are not allowed.', () => {
        expect(() => new simple_string_pattern_1.default('... \\a')).toThrow();
        expect(() => new simple_string_pattern_1.default('\\a ...')).toThrow();
        expect(() => new simple_string_pattern_1.default('... \\a ...')).toThrow();
    });
    test('Does not accept a string its pattern body ends with odd number of consecutive backslash characters.', () => {
        expect(() => new simple_string_pattern_1.default('... \\ ...')).toThrow();
        expect(() => new simple_string_pattern_1.default('... \\\\\\ ...')).toThrow();
        expect(() => new simple_string_pattern_1.default('... a\\\\\\ ...')).toThrow();
    });
});
// ----------------------------------------------------------------------------
describe('Partial Pattern: constructor and getters - single character', () => {
    test('Does allow one character (ascii)', () => {
        expect(new simple_string_pattern_1.default('... a').value()).toEqual('... a');
    });
    test('Does allow one character (non-ascii)', () => {
        expect(new simple_string_pattern_1.default('き ...').value()).toEqual('き ...');
    });
    test('Does allow one character (emoji)', () => {
        expect(new simple_string_pattern_1.default('... 😀 ...').value()).toEqual('... 😀 ...');
    });
    test('Does allow a dot character (.)', () => {
        expect(new simple_string_pattern_1.default('... .').value()).toEqual('... .');
    });
    test('Does allow a double-quote character (")', () => {
        expect(new simple_string_pattern_1.default('... "').value()).toEqual('... "');
    });
});
// ----------------------------------------------------------------------------
describe('Partial Pattern: constructor and getters - multiple characters', () => {
    test('Does allow empty value by passing a string that contains two double-quotes.', () => {
        expect(new simple_string_pattern_1.default('... ""').value()).toEqual('... ""');
        expect(new simple_string_pattern_1.default('"" ...').value()).toEqual('"" ...');
        expect(new simple_string_pattern_1.default('... "" ...').value()).toEqual('... "" ...');
    });
    test('Does allow normal strings, without leading and trailing spaces', () => {
        [
            '... Hello',
            'Hello World! ...',
            "... That's a 😀! ...",
            '... きáéÜΔδ ...',
        ].forEach(s => {
            expect(new simple_string_pattern_1.default(s).value()).toEqual(s);
        });
    });
    test('Does allow string with dots at the start and/or end, still being in a pattern body', () => {
        ['.', '..', '.. ..', '. .', '.Hello.', '..Hello..'].forEach(s => {
            const sp = '... ' + s;
            expect(new simple_string_pattern_1.default(sp).value()).toEqual(sp);
            const sp2 = s + ' ...';
            expect(new simple_string_pattern_1.default(sp2).value()).toEqual(sp2);
            const sp3 = '... ' + s + ' ...';
            expect(new simple_string_pattern_1.default(sp3).value()).toEqual(sp3);
        });
    });
    test('Does allow string with double quotes', () => {
        [
            'That\'s "inside" it.',
            '" Double quotes ensure that leading and trailing spaces matter in the matching process.  "',
            '""That\'s a "hit"!""',
            'Double quote at the end: "',
            '"Double quote at the start.',
        ].forEach(s => {
            const sp = '... ' + s;
            expect(new simple_string_pattern_1.default(sp).value()).toEqual(sp);
            const sp2 = s + ' ...';
            expect(new simple_string_pattern_1.default(sp2).value()).toEqual(sp2);
            const sp3 = '... ' + s + ' ...';
            expect(new simple_string_pattern_1.default(sp3).value()).toEqual(sp3);
        });
    });
});
describe('Full Pattern: constructor and getters - escape sequences', () => {
    test('Does allow escaped common control ASCII character.', () => {
        ['\\', 't', 'r', 'n', 'f', 'b', '"', "'"].forEach(val => {
            const sp = '... ' + '\\' + val;
            expect(new simple_string_pattern_1.default(sp).value()).toEqual(sp);
            const sp2 = '\\' + val + ' ...';
            expect(new simple_string_pattern_1.default(sp2).value()).toEqual(sp2);
            const sp3 = '... ' + '\\' + val + ' ...';
            expect(new simple_string_pattern_1.default(sp3).value()).toEqual(sp3);
        });
    });
    test('Does allow escapes in a text.', () => {
        [
            '... Two line\\n text',
            '\\" (\\\', \\") \\" ...',
            '... \\\\ escaped backslash: \\\\. ...',
            '... A literal form of newline escape sequence: \\\\n.',
        ].forEach(s => {
            expect(new simple_string_pattern_1.default(s).value()).toEqual(s);
        });
    });
});
