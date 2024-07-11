import SSP from '#src/simple-string-pattern';

describe('Pattern: limitPatternLen errors', () => {
  test('Throws Error if negative argument is provided.', () => {
    expect(() => new SSP('abc').limitPatternLen(-1)).toThrow();
  });

  test('Can only be called by a Full Pattern or Start Pattern.', () => {
    expect(() => new SSP('... abc').limitPatternLen(10)).toThrow();
    expect(() => new SSP('... abc ...').limitPatternLen(10)).toThrow();
  });
});

test('Returns an empty Start Pattern SSPs if MaxPatternLength parameter is set to 0.', () => {
  [
    ['0', '"abcd"', '"" ...', 'abcd'],
    ['0', '""', '""', ''],
    ['0', '"" ...', '"" ...', 'abcdefgh'],
  ].forEach(([len, pattStr, expectedLimitedValue, input]) => {
    const patt = new SSP(pattStr);
    const limitedPatt = patt.limitPatternLen(Number.parseInt(len));
    expect(limitedPatt.value()).toEqual(expectedLimitedValue);
    expect(patt.test(input)).toBeTruthy();
    expect(limitedPatt.test(input)).toBeTruthy();
  });
});

describe('Pattern: limitPatternLen', () => {
  test("For a maxPatternLength value higher than or equal SSP's body character count, returns the same SSP objects.", () => {
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
      '" start pattern " ...',
      '12345678901234567890123456789012345678901234567890',
    ].forEach(pattStr => {
      const patt = new SSP(pattStr);
      expect(patt.value()).toEqual(patt.limitPatternLen(50).value());
    });
  });

  test('Returns Start Pattern SSPs that do match the same input as simple full originals.', () => {
    [
      ['ab', 'ab', 'ab'],
      ['Hello, World', 'Hello, ...', 'Hello, World'],
      ['AbcDefGhi ...', 'AbcDef ...', 'AbcDefGhiJk'],
      ['That\'s "inside" it.', "That's ...", 'That\'s "inside" it.'],
    ].forEach(([pattStr, expectedLimitedValue, input]) => {
      const patt = new SSP(pattStr);
      const limitedPatt = patt.limitPatternLen(6);
      expect(limitedPatt.value()).toEqual(expectedLimitedValue);
      expect(patt.test(input)).toBeTruthy();
      expect(limitedPatt.test(input)).toBeTruthy();
    });
  });

  test('Creates an exact pattern when necessary.', () => {
    [
      ['Hello world!', '"Hello " ...', 'Hello world!'],
      ['" Hello, World"', '" Hello" ...', ' Hello, World'],
      ['AbcDefGhi ...', 'AbcDef ...', 'AbcDefGhiJk'],
    ].forEach(([pattStr, expectedLimitedValue, input]) => {
      const patt = new SSP(pattStr);
      const limitedPatt = patt.limitPatternLen(6);
      expect(limitedPatt.value()).toEqual(expectedLimitedValue);
      expect(patt.test(input)).toBeTruthy();
      expect(limitedPatt.test(input)).toBeTruthy();
    });

    expect(SSP.parse('').limitPatternLen(0).value()).toEqual('""');
  });

  test('Does not count enclosing double quotes in an exact pattern.', () => {
    [
      ['2', '"abcd"', 'ab ...', 'abcd'],
      ['1', '"abcd" ...', 'a ...', 'abcdefgh'],
    ].forEach(([len, pattStr, expectedLimitedValue, input]) => {
      const patt = new SSP(pattStr);
      const limitedPatt = patt.limitPatternLen(Number.parseInt(len));
      expect(limitedPatt.value()).toEqual(expectedLimitedValue);
      expect(patt.test(input)).toBeTruthy();
      expect(limitedPatt.test(input)).toBeTruthy();
    });
  });

  test('MaxPatternLength parameter counts any escape sequence as one item.', () => {
    [
      ['4', 'abc\\\\\\\\', 'abc\\\\ ...', 'abc\\\\'],
      ['1', '\\\\\\\\', '\\\\ ...', '\\\\'],
      ['4', 'Ab \\nC ...', 'Ab \\n ...', 'Ab \nCDefGhiJk'],
      ['4', 'Ab \\nC ...', 'Ab \\n ...', 'Ab \nCDefGhiJk'],
    ].forEach(([len, pattStr, expectedLimitedValue, input]) => {
      const patt = new SSP(pattStr);
      const limitedPatt = patt.limitPatternLen(Number.parseInt(len));
      expect(limitedPatt.value()).toEqual(expectedLimitedValue);
      expect(patt.test(input)).toBeTruthy();
      expect(limitedPatt.test(input)).toBeTruthy();
    });
  });

  test('MaxPatternLength parameter counts any multi-byte unicode character as one item.', () => {
    const patt = new SSP('1234😀678');
    const limitedPatt = patt.limitPatternLen(6);
    expect(limitedPatt.value()).toEqual('1234😀6 ...');
    expect(patt.test('1234😀678')).toBeTruthy();
    expect(limitedPatt.test('1234😀678')).toBeTruthy();
  });

  test('Returns the copy of SSP Object. That copy does match everything the original object does.', () => {
    {
      const patt = new SSP('1234');
      const pattC = patt.limitPatternLen(2);
      expect(pattC === patt).toBeFalsy();
      expect(patt.test('1234')).toBeTruthy();
      expect(pattC.test('1234')).toBeTruthy();

      const pattC2 = patt.limitPatternLen(4);
      expect(pattC2 === patt).toBeFalsy();
      expect(pattC2.test('1234')).toBeTruthy();
    }
  });
});
