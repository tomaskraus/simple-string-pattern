import SSP from '#src/simple-string-pattern';
import u from './test-utils';

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
      [u.id, u.toStartPatt, u.toEndPatt, u.toMiddlePatt].forEach(pattModfn => {
        const patt = new SSP(pattModfn(pattStr));
        // console.log('pattV:', patt.value());
        expect(new SSP(patt.value()).value() === patt.value()).toBeTruthy();
      });
    });
  });
});
