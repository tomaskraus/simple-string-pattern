import SSP from '#src/simple-string-pattern';

describe('Parse: errors', () => {
  test('Throws an Error if input contains forbidden characters.', () => {
    expect(() => SSP.parse(String.fromCharCode(0))).toThrow();
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
  test('Makes an Exact Pattern if leading or trailing spaces are found.', () => {
    [
      [' abc', '" abc"'],
      ['abc ', '"abc "'],
      [' abc ', '" abc "'],
    ].forEach(([input, expectedValue]) => {
      expect(SSP.parse(input).value()).toEqual(expectedValue);
    });
  });
});

describe('Parse(): enclosing double-quotes', () => {
  test('Treats enclosing double-quotes literally (without ExactPattern special meaning).', () => {
    [
      ['"abc"', '\\"abc"'],
      ['"a"', '\\"a"'],
      ['""', '\\""'],
    ].forEach(([input, expectedValue]) => {
      expect(SSP.parse(input).value()).toEqual(expectedValue);
    });
  });

  test('Treats escaped leading double quote literally (simply leaves that backslash here).', () => {
    expect(SSP.parse('\\"abc"').value()).toEqual('\\\\"abc"');
  });
});

describe('Parse(): Partial-Pattern-like inputs', () => {
  test('Treats partial marks (...) literally (without PartialPattern special meaning).', () => {
    [
      ['abc ...', '"abc ..."'],
      ['abc" ...', '"abc" ..."'],
      ['... abc', '"... abc"'],
      ['... abc ...', '"... abc ..."'],
      ['... ', '"... "'],
      [' ...', '" ..."'],
      ['...  ...', '"...  ..."'],
    ].forEach(([input, expectedValue]) => {
      expect(SSP.parse(input).value()).toEqual(expectedValue);
    });
  });
});
