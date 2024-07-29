import SSP from '#src/simple-string-pattern';
import u from './test-utils';

describe('Pattern: specials', () => {
  test('value() invariants.', () => {
    [
      '""',
      '"a"',
      '\\"a"',
      '""a""',
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
      '\\" abc"',
    ].forEach(pattStr => {
      [u.id, u.toStartPatt, u.toEndPatt, u.toMiddlePatt].forEach(pattModfn => {
        const patt = new SSP(pattModfn(pattStr));
        // console.log('pattV:', patt.value());
        expect(new SSP(patt.value()).value() === patt.value()).toBeTruthy();
      });
    });
  });

  test('A pattern that was parsed from input does match that exact input.', () => {
    [
      '',
      '""',
      '"a"',
      '""a""',
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
      ' ',
      ' abc ',
      'Hello\nWorld!',
      '\t\r\n\b\f\\',
      '... ',
      ' ...',
      '...  ...',
      '\\" abc"',
    ].forEach(pattStrBase => {
      [u.id, u.toStartPatt, u.toEndPatt, u.toMiddlePatt].forEach(pattModfn => {
        const pattStr = pattModfn(pattStrBase);
        const patt = SSP.parse(pattStr);
        // console.log('pattV:', patt.value());
        expect(patt.test(pattStr)).toBeTruthy();
      });
    });
  });

  test('Accepts common characters', () => {
    const common_chars = '`~!@#$%^&*()_-+=()[]{}:;"\'|<>,.?/\\';
    const patt = SSP.parse(common_chars);
    expect(patt.test(common_chars)).toBeTruthy();
  });
});
