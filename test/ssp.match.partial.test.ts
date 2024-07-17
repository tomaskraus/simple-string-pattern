import SSP from '#src/simple-string-pattern';
import u from './test-utils';

describe('Partial Pattern: match', () => {
  test('Start Pattern,End Pattern and Middle Pattern do match corresponding inputs.', () => {
    [
      ['Hello', 'Hello'],
      ['Hello, World', 'Hello, World'],
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
    ].forEach(([pattStr, input]) => {
      [u.toStartPatt, u.toMiddlePatt].forEach(pattModfn => {
        const patt = new SSP(pattModfn(pattStr));
        [u.id, (s: string) => u.addSuffix('aa', s)].forEach(inputModFn => {
          expect(patt.test(inputModFn(input))).toBeTruthy();
        });
      });

      [u.toEndPatt, u.toMiddlePatt].forEach(pattModfn => {
        const patt = new SSP(pattModfn(pattStr));
        [u.id, (s: string) => u.addPrefix('aa', s)].forEach(inputModFn => {
          expect(patt.test(inputModFn(input))).toBeTruthy();
        });
      });

      const patt = new SSP(u.toMiddlePatt(pattStr));
      [
        u.id,
        (s: string) => u.addPrefix('aa', s),
        (s: string) => u.addSuffix('aa', s),
        (s: string) => u.addPrefix('aa', u.addSuffix('aa', s)),
      ].forEach(inputModFn => {
        expect(patt.test(inputModFn(input))).toBeTruthy();
      });
    });
  });

  test('If pattern body value has its leading double quote escaped, does not act as an Exact Pattern.', () => {
    const patt = new SSP('... \\" hello"');
    expect(patt.test('a" hello"')).toBeTruthy();
    expect(patt.test('a hello')).toBeFalsy();

    const patt2 = new SSP('... " hello"');
    expect(patt2.test('a hello')).toBeTruthy();
    expect(patt2.test('a" hello"')).toBeFalsy();

    const patt3 = new SSP('\\" hello" ...');
    expect(patt3.test('" hello"A')).toBeTruthy();
    expect(patt3.test(' helloA')).toBeFalsy();

    const patt4 = new SSP('" hello" ...');
    expect(patt4.test(' helloA')).toBeTruthy();
    expect(patt4.test('" hello"A')).toBeFalsy();
  });
});

describe('Partial Pattern: match empty string:', () => {
  test('A "" Partial empty Pattern does match any input.', () => {
    [
      '',
      'Hello',
      'Hello, World',
      "That's a 😀! きáéÜΔ",
      'That\'s "inside" it.',
      ' leading and trailing spaces matter.  ',
      '"Double quote at the start.',
      '.',
      '..',
      '. .',
      'Two line\n text',
      '" (\', ") "',
      '\\ escaped backslash: \\.',
      'A literal form of newline escape sequence: \\\\n.',
    ].forEach(input => {
      expect(new SSP('... ""').test(input)).toBeTruthy();
      expect(new SSP('"" ...').test(input)).toBeTruthy();
      expect(new SSP('... "" ...').test(input)).toBeTruthy();
    });
  });
});

describe('Partial Pattern: no match:', () => {
  test('Non-empty Partial Pattern does not match an empty input.', () => {
    expect(new SSP('... a').test('')).toBeFalsy();
    expect(new SSP('a ...').test('')).toBeFalsy();
    expect(new SSP('... a ...').test('')).toBeFalsy();
  });

  test('Non-empty Partial Pattern does not match a lesser input.', () => {
    expect(new SSP('... abc').test('ab')).toBeFalsy();
    expect(new SSP('abc ...').test('ab')).toBeFalsy();
    expect(new SSP('... abc ...').test('ab')).toBeFalsy();
  });
});
