import SSP from '#src/simple-string-pattern';

describe.skip('Parse: failures', () => {
  test('Does not accept a string containing those escape sequences that are not allowed.', () => {
    expect(() => SSP.parse('\\ ')).toThrow();
    expect(() => SSP.parse('a\\a')).toThrow();
    expect(() => SSP.parse('\\')).toThrow(); //single backslash character
  });
});

describe('Parse: simple', () => {
  test('Parses an empty string', () => {
    expect(SSP.parse('').value()).toEqual('""');
  });

  test('Parses strings with no specials (enclosing spaces and double quotes, escapes)', () => {
    ['hello', "That's a 😀! きáéÜΔ", 'a'].forEach(input => {
      expect(SSP.parse(input).value()).toEqual(input);
    });
  });
});

describe('Parse: escapes', () => {
  test('Parse: Special chars and backslash character are escaped in a string.', () => {
    [
      ['Hello \nWorld!', 'Hello \\nWorld!'],
      ['a \t \b\t b', 'a \\t \\b\\t b'],
      ['\\', '\\\\'],
      ['c:\\windows\\system', 'c:\\\\windows\\\\system'],
    ].forEach(([input, expectedValue]) => {
      expect(SSP.parse(input).value()).toEqual(expectedValue);
    });
  });
});

describe('Parse: leading and trailing spaces', () => {
  test('Makes an exact pattern if leading or trailing spaces are found.', () => {
    [
      [' abc', '" abc"'],
      ['abc ', '"abc "'],
      [' abc ', '" abc "'],
    ].forEach(([input, expectedValue]) => {
      expect(SSP.parse(input).value()).toEqual(expectedValue);
    });
  });

  test('Makes an exact pattern if enclosing double-quotes are found.', () => {
    [
      ['abc"', 'abc"'],
      ['"abc', '"abc'],
      ['"abc"', '""abc""'],
      [' abc"', '" abc""'],
    ].forEach(([input, expectedValue]) => {
      expect(SSP.parse(input).value()).toEqual(expectedValue);
    });
  });
});
