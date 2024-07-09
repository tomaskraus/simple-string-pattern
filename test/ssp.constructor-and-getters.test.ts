import SSP from '#src/simple-string-pattern';

describe('Full Pattern: constructor errors', () => {
  test('does not accept an empty string', () => {
    expect(() => new SSP('')).toThrow();
  });

  test('does not accept a string which starts and/or ends with space ( )', () => {
    ['a ', ' a', ' a ', ' ', 'ab ', ' ab', ' ab ', '  a b '].forEach(s => {
      expect(() => new SSP(s)).toThrow();
    });
  });

  test('does not accept strings that contain unescaped control chars', () => {
    const tabStr = String.fromCharCode(9);
    expect(() => new SSP(tabStr)).toThrow();
    const unescapedMultilineStr = 'a\nb';
    expect(() => new SSP(unescapedMultilineStr)).toThrow();
  });

  test('does not accept a string containing those escape sequences that are not allowed', () => {
    expect(() => new SSP('\\ ')).toThrow();
    expect(() => new SSP('a\\a')).toThrow();
  });
});

// ----------------------------------------------------------------------------

describe('Full Pattern: constructor and getters - single character', () => {
  test('does allow one character (ascii)', () => {
    const patt = new SSP('a');
    expect(patt.value()).toEqual('a');
  });

  test('does allow one character (non-ascii)', () => {
    const patt = new SSP('き');
    expect(patt.value()).toEqual('き');
  });

  test('does allow one character (emoji)', () => {
    const patt = new SSP('😀');
    expect(patt.value()).toEqual('😀');
  });

  test('does allow a dot character (.)', () => {
    const patt = new SSP('.');
    expect(patt.value()).toEqual('.');
  });

  test('does allow a double-quote character (")', () => {
    const patt = new SSP('"');
    expect(patt.value()).toEqual('"');
  });
});

describe('Full Pattern: constructor and getters - multiple characters', () => {
  test('does allow empty value by passing a string that contains two double-quotes.', () => {
    const patt = new SSP('""');
    expect(patt.value()).toEqual('""');
  });

  test('does allow normal strings, without leading and trailing spaces', () => {
    [
      'Hello',
      'Hello World!',
      "That's a 😀!",
      'from 🌀, through emoticons: 😀, to extended symbols: 🫖',
      '(1 + 1) / 2 = ?',
      'きáéÜΔδ',
    ].forEach(s => {
      const patt = new SSP(s);
      expect(patt.value()).toEqual(s);
    });
  });

  test('does allow string with dots at the start and/or end, still being in a pattern body', () => {
    ['.', '..', '.. ..', '. .', '.Hello.', '..Hello..'].forEach(s => {
      const patt = new SSP(s);
      expect(patt.value()).toEqual(s);
    });
  });

  test('does allow string with double quotes', () => {
    [
      'That\'s "inside" it.',
      '" Double quotes ensure that leading and trailing spaces matter in the matching process.  "',
      '""That\'s a "hit"!""',
      'Double quote at the end: "',
      '"Double quote at the start.',
    ].forEach(s => {
      const patt = new SSP(s);
      expect(patt.value()).toEqual(s);
    });
  });
});

describe('Full Pattern: constructor and getters - escape sequences', () => {
  test('Does allow escaped common control ASCII character.', () => {
    ['\\', 't', 'r', 'n', 'f', 'b', '"', "'"].forEach(val => {
      const s = `\\${val}`;
      const patt = new SSP(s);
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
      const patt = new SSP(s);
      expect(patt.value()).toEqual(s);
    });
  });
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

describe('Partial Pattern: constructor errors', () => {
  test('Does not accept an "empty-matching" Start Pattern without implicit "".', () => {
    expect(() => new SSP(' ...')).toThrow();
  });

  test('Does not accept an "empty-matching" End Pattern without implicit "".', () => {
    expect(() => new SSP('... ')).toThrow();
  });

  test('Does not accept an "empty-matching" Middle Pattern without implicit "".', () => {
    expect(() => new SSP('...  ...')).toThrow();
  });

  test('Does not accept a string which starts and/or ends with space ( ).', () => {
    ['a ', ' a', ' a ', ' ', 'ab ', ' ab', ' ab ', '  a b '].forEach(s => {
      expect(() => new SSP(s)).toThrow();
    });
  });

  test('Does not accept strings that contain unescaped control chars.', () => {
    const tabStr = String.fromCharCode(9);
    expect(() => new SSP('... ' + tabStr)).toThrow();
    const unescapedMultilineStr = 'a\nb';
    expect(() => new SSP(unescapedMultilineStr + ' ...')).toThrow();
  });

  test('Does not accept a string containing those escape sequences that are not allowed.', () => {
    expect(() => new SSP('... \\ ...')).toThrow();
    expect(() => new SSP('... \\a')).toThrow();
    expect(() => new SSP('\\a ...')).toThrow();
    expect(() => new SSP('... \\a ...')).toThrow();
  });
});

// ----------------------------------------------------------------------------

describe('Partial Pattern: constructor and getters - single character', () => {
  test('does allow one character (ascii)', () => {
    expect(new SSP('... a').value()).toEqual('... a');
  });

  test('does allow one character (non-ascii)', () => {
    expect(new SSP('き ...').value()).toEqual('き ...');
  });

  test('does allow one character (emoji)', () => {
    expect(new SSP('... 😀 ...').value()).toEqual('... 😀 ...');
  });

  test('does allow a dot character (.)', () => {
    expect(new SSP('... .').value()).toEqual('... .');
  });

  test('does allow a double-quote character (")', () => {
    expect(new SSP('... "').value()).toEqual('... "');
  });
});

// ----------------------------------------------------------------------------

describe('Partial Pattern: constructor and getters - multiple characters', () => {
  test('does allow empty value by passing a string that contains two double-quotes.', () => {
    expect(new SSP('... ""').value()).toEqual('... ""');
    expect(new SSP('"" ...').value()).toEqual('"" ...');
    expect(new SSP('... "" ...').value()).toEqual('... "" ...');
  });

  test('does allow normal strings, without leading and trailing spaces', () => {
    [
      '... Hello',
      'Hello World! ...',
      "... That's a 😀! ...",
      '... きáéÜΔδ ...',
    ].forEach(s => {
      expect(new SSP(s).value()).toEqual(s);
    });
  });

  test('does allow string with dots at the start and/or end, still being in a pattern body', () => {
    ['.', '..', '.. ..', '. .', '.Hello.', '..Hello..'].forEach(s => {
      const sp = '... ' + s;
      expect(new SSP(sp).value()).toEqual(sp);
      const sp2 = s + ' ...';
      expect(new SSP(sp2).value()).toEqual(sp2);
      const sp3 = '... ' + s + ' ...';
      expect(new SSP(sp3).value()).toEqual(sp3);
    });
  });

  test('does allow string with double quotes', () => {
    [
      'That\'s "inside" it.',
      '" Double quotes ensure that leading and trailing spaces matter in the matching process.  "',
      '""That\'s a "hit"!""',
      'Double quote at the end: "',
      '"Double quote at the start.',
    ].forEach(s => {
      const sp = '... ' + s;
      expect(new SSP(sp).value()).toEqual(sp);
      const sp2 = s + ' ...';
      expect(new SSP(sp2).value()).toEqual(sp2);
      const sp3 = '... ' + s + ' ...';
      expect(new SSP(sp3).value()).toEqual(sp3);
    });
  });
});

describe('Full Pattern: constructor and getters - escape sequences', () => {
  test('Does allow escaped common control ASCII character.', () => {
    ['\\', 't', 'r', 'n', 'f', 'b', '"', "'"].forEach(val => {
      const sp = '... ' + '\\' + val;
      expect(new SSP(sp).value()).toEqual(sp);
      const sp2 = '\\' + val + ' ...';
      expect(new SSP(sp2).value()).toEqual(sp2);
      const sp3 = '... ' + '\\' + val + ' ...';
      expect(new SSP(sp3).value()).toEqual(sp3);
    });
  });

  test('Does allow escapes in a text.', () => {
    [
      '... Two line\\n text',
      '\\" (\\\', \\") \\" ...',
      '... \\\\ escaped backslash: \\\\. ...',
      '... A literal form of newline escape sequence: \\\\n.',
    ].forEach(s => {
      expect(new SSP(s).value()).toEqual(s);
    });
  });
});
