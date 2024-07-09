import SSP from '#src/simple-string-pattern';
import u from './test-utils';

describe('Pattern: specials', () => {
  test('value() invariants.', () => {
    const patterns = [
      ['""', ''],
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

    patterns.forEach(([pattStr, _]) => {
      [u.id, u.toStartPatt, u.toEndPatt, u.toMiddlePatt].forEach(pattModfn => {
        const patt = new SSP(pattModfn(pattStr));
        // console.log('pattV:', patt.value());
        expect(new SSP(patt.value()).value() === patt.value()).toBeTruthy();
      });
    });
  });
});
