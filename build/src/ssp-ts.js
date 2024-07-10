"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) {
    return d[0];
}
const DOT = '.';
const PART_MARK = DOT + DOT + DOT;
const pObjectFromSingle = (d) => {
    const val = Array.isArray(d) ? id(d) : d;
    return { value: val, body: val };
};
const pObjectFromArray = (arr) => {
    const val = flatten(arr);
    return { value: val, body: val };
};
const flatten = (arr) => arr.reduce((acc, s) => acc + (Array.isArray(s) ? flatten(s) : s), '');
const grammar = {
    Lexer: undefined,
    ParserRules: [
        { name: 'Main', symbols: ['FULL_PATTERN'], postprocess: id },
        { name: 'Main', symbols: ['PARTIAL_PATTERN'], postprocess: id },
        {
            name: 'FULL_PATTERN',
            symbols: ['PBODY'],
            postprocess: ([pbody]) => (Object.assign({ type: 'F' }, pbody)),
        },
        { name: 'PARTIAL_PATTERN', symbols: ['START_PATTERN'], postprocess: id },
        { name: 'PARTIAL_PATTERN', symbols: ['END_PATTERN'], postprocess: id },
        { name: 'PARTIAL_PATTERN', symbols: ['MIDDLE_PATTERN'], postprocess: id },
        { name: 'START_PATTERN$ebnf$1$subexpression$1', symbols: ['_'] },
        {
            name: 'START_PATTERN$ebnf$1',
            symbols: ['START_PATTERN$ebnf$1$subexpression$1'],
        },
        { name: 'START_PATTERN$ebnf$1$subexpression$2', symbols: ['_'] },
        {
            name: 'START_PATTERN$ebnf$1',
            symbols: ['START_PATTERN$ebnf$1', 'START_PATTERN$ebnf$1$subexpression$2'],
            postprocess: d => d[0].concat([d[1]]),
        },
        {
            name: 'START_PATTERN',
            symbols: ['PBODY', 'START_PATTERN$ebnf$1', 'PMARK'],
            postprocess: d => (Object.assign(Object.assign({ type: 'S' }, d[0]), { value: `${d[0].value} ${PART_MARK}` })),
        },
        { name: 'END_PATTERN$ebnf$1$subexpression$1', symbols: ['_'] },
        {
            name: 'END_PATTERN$ebnf$1',
            symbols: ['END_PATTERN$ebnf$1$subexpression$1'],
        },
        { name: 'END_PATTERN$ebnf$1$subexpression$2', symbols: ['_'] },
        {
            name: 'END_PATTERN$ebnf$1',
            symbols: ['END_PATTERN$ebnf$1', 'END_PATTERN$ebnf$1$subexpression$2'],
            postprocess: d => d[0].concat([d[1]]),
        },
        {
            name: 'END_PATTERN',
            symbols: ['PMARK', 'END_PATTERN$ebnf$1', 'PBODY'],
            postprocess: d => (Object.assign(Object.assign({ type: 'E' }, d[2]), { value: `${PART_MARK} ${d[2].value}` })),
        },
        { name: 'MIDDLE_PATTERN$ebnf$1$subexpression$1', symbols: ['_'] },
        {
            name: 'MIDDLE_PATTERN$ebnf$1',
            symbols: ['MIDDLE_PATTERN$ebnf$1$subexpression$1'],
        },
        { name: 'MIDDLE_PATTERN$ebnf$1$subexpression$2', symbols: ['_'] },
        {
            name: 'MIDDLE_PATTERN$ebnf$1',
            symbols: [
                'MIDDLE_PATTERN$ebnf$1',
                'MIDDLE_PATTERN$ebnf$1$subexpression$2',
            ],
            postprocess: d => d[0].concat([d[1]]),
        },
        { name: 'MIDDLE_PATTERN$ebnf$2$subexpression$1', symbols: ['_'] },
        {
            name: 'MIDDLE_PATTERN$ebnf$2',
            symbols: ['MIDDLE_PATTERN$ebnf$2$subexpression$1'],
        },
        { name: 'MIDDLE_PATTERN$ebnf$2$subexpression$2', symbols: ['_'] },
        {
            name: 'MIDDLE_PATTERN$ebnf$2',
            symbols: [
                'MIDDLE_PATTERN$ebnf$2',
                'MIDDLE_PATTERN$ebnf$2$subexpression$2',
            ],
            postprocess: d => d[0].concat([d[1]]),
        },
        {
            name: 'MIDDLE_PATTERN',
            symbols: [
                'PMARK',
                'MIDDLE_PATTERN$ebnf$1',
                'PBODY',
                'MIDDLE_PATTERN$ebnf$2',
                'PMARK',
            ],
            postprocess: d => (Object.assign(Object.assign({ type: 'M' }, d[2]), { value: `${PART_MARK} ${d[2].value} ${PART_MARK}` })),
        },
        { name: 'PBODY', symbols: ['SPACE_EXACT_BODY'], postprocess: id },
        { name: 'PBODY', symbols: ['SPACE_TRIMMED_BODY'], postprocess: id },
        {
            name: 'SPACE_EXACT_BODY',
            symbols: ['DQUOTE', 'INNER_TEXT', 'DQUOTE'],
            postprocess: ([ldq, body, pdq]) => {
                const pObject = pObjectFromSingle(body); /*strips outermost double-quotes*/
                return Object.assign(Object.assign({}, pObject), { value: ldq + body + pdq }); /*surround value with double-quotes*/
            },
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['CHAR_OR_DQUOTE'],
            postprocess: pObjectFromSingle,
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['MAX_2_DOTS'],
            postprocess: pObjectFromArray,
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['CHAR_OR_DQUOTE', 'MAX_2_DOTS'],
            postprocess: pObjectFromArray,
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['MAX_2_DOTS', 'CHAR_OR_DQUOTE'],
            postprocess: pObjectFromArray,
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['MAX_2_DOTS', 'INNER_CHAR_NO_DOT', 'MAX_2_DOTS'],
            postprocess: pObjectFromArray,
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['BODY_START', 'INNER_TEXT', 'BODY_END'],
            postprocess: pObjectFromArray,
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['BODY_START', 'INNER_TEXT', 'DQUOTE'],
            postprocess: pObjectFromArray,
        },
        {
            name: 'SPACE_TRIMMED_BODY',
            symbols: ['DQUOTE', 'INNER_TEXT', 'BODY_END'],
            postprocess: pObjectFromArray,
        },
        { name: 'BODY_START', symbols: ['CHAR'], postprocess: id },
        {
            name: 'BODY_START',
            symbols: ['MAX_2_DOTS', 'INNER_CHAR_NO_DOT'],
            postprocess: flatten,
        },
        { name: 'BODY_END', symbols: ['CHAR'], postprocess: id },
        {
            name: 'BODY_END',
            symbols: ['INNER_CHAR_NO_DOT', 'MAX_2_DOTS'],
            postprocess: flatten,
        },
        { name: 'MAX_2_DOTS', symbols: ['DOT'], postprocess: id },
        { name: 'MAX_2_DOTS', symbols: ['DOT', 'DOT'], postprocess: flatten },
        { name: 'INNER_TEXT$ebnf$1', symbols: [] },
        { name: 'INNER_TEXT$ebnf$1$subexpression$1', symbols: ['INNER_CHAR'] },
        {
            name: 'INNER_TEXT$ebnf$1',
            symbols: ['INNER_TEXT$ebnf$1', 'INNER_TEXT$ebnf$1$subexpression$1'],
            postprocess: d => d[0].concat([d[1]]),
        },
        { name: 'INNER_TEXT', symbols: ['INNER_TEXT$ebnf$1'], postprocess: flatten },
        { name: 'DQUOTE', symbols: [{ literal: '"' }], postprocess: id },
        { name: 'CHAR_OR_DQUOTE', symbols: ['CHAR'], postprocess: id },
        { name: 'CHAR_OR_DQUOTE', symbols: ['DQUOTE'], postprocess: id },
        { name: 'PMARK', symbols: ['DOT', 'DOT', 'DOT'], postprocess: flatten },
        { name: 'INNER_CHAR', symbols: ['CHAR'], postprocess: id },
        { name: 'INNER_CHAR', symbols: ['RESERVED_CHAR'], postprocess: id },
        { name: 'INNER_CHAR_NO_DOT', symbols: ['CHAR'], postprocess: id },
        {
            name: 'INNER_CHAR_NO_DOT',
            symbols: ['RESERVED_CHAR_NO_DOT'],
            postprocess: id,
        },
        { name: 'RESERVED_CHAR', symbols: ['DOT'], postprocess: id },
        { name: 'RESERVED_CHAR', symbols: ['RESERVED_CHAR_NO_DOT'], postprocess: id },
        { name: 'RESERVED_CHAR_NO_DOT', symbols: ['_'], postprocess: id },
        { name: 'RESERVED_CHAR_NO_DOT', symbols: ['DQUOTE'], postprocess: id },
        { name: 'CHAR', symbols: [/[\u0021]/], postprocess: id },
        { name: 'CHAR', symbols: [/[\u0023-\u002D]/], postprocess: id },
        { name: 'CHAR', symbols: [/[\u002F-\u005B]/], postprocess: id },
        { name: 'CHAR', symbols: [/[\u005D-\u007E]/], postprocess: id },
        { name: 'CHAR', symbols: [/[\u0080-\uD7FF]/], postprocess: id },
        {
            name: 'CHAR',
            symbols: ['EMOJI_CHAR'],
            postprocess: d => id(d).join('') /*compose an emoji character*/,
        },
        { name: 'CHAR', symbols: ['ESCAPE_SEQ'], postprocess: id },
        { name: '_', symbols: [{ literal: ' ' }], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$1',
            symbols: [{ literal: '\\' }, { literal: '\\' }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$1'], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$2',
            symbols: [{ literal: '\\' }, { literal: 't' }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$2'], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$3',
            symbols: [{ literal: '\\' }, { literal: 'r' }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$3'], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$4',
            symbols: [{ literal: '\\' }, { literal: 'n' }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$4'], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$5',
            symbols: [{ literal: '\\' }, { literal: 'f' }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$5'], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$6',
            symbols: [{ literal: '\\' }, { literal: 'b' }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$6'], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$7',
            symbols: [{ literal: '\\' }, { literal: '"' }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$7'], postprocess: id },
        {
            name: 'ESCAPE_SEQ$string$8',
            symbols: [{ literal: '\\' }, { literal: "'" }],
            postprocess: d => d.join(''),
        },
        { name: 'ESCAPE_SEQ', symbols: ['ESCAPE_SEQ$string$8'], postprocess: id },
        { name: 'DOT', symbols: [{ literal: '.' }], postprocess: id },
        { name: 'EMOJI_CHAR', symbols: [/[\uD83C]/, /[\uDF00-\uDFFF]/] },
        { name: 'EMOJI_CHAR', symbols: [/[\uD83D]/, /[\uDC00-\uDDFF]/] },
        { name: 'EMOJI_CHAR', symbols: [/[\uD83D]/, /[\uDE00-\uDE4F]/] },
        { name: 'EMOJI_CHAR', symbols: [/[\uD83D]/, /[\uDE80-\uDEFC]/] },
        { name: 'EMOJI_CHAR', symbols: [/[\uD83E]/, /[\uDD00-\uDDFF]/] },
        { name: 'EMOJI_CHAR', symbols: [/[\uD83E]/, /[\uDE00-\uDE6D]/] },
        { name: 'EMOJI_CHAR', symbols: [/[\uD83E]/, /[\uDE70-\uDED6]/] },
    ],
    ParserStart: 'Main',
};
exports.default = grammar;
