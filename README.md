# Simple String Pattern

A **Simple String Pattern** (a.k.a. **SSP**) is a very simple pattern used to match a string.  
A **simple-string-pattern** is also a name of the library for dealing with _Simple String Patterns_, [here](#simple-string-pattern-library) in this document.

Unlike [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions), _Simple String Pattern_ intentionally lacks a lot of features, to be very easy to read and understand.

The motivation to create such a thing as the SSP was the need for writing a [Doctest](https://docs.python.org/3/library/doctest.html)-like testing tool, where user can write string output assertions right into code comments:

```js
console.log(1 + 1);
//=> 2

console.log(1 + 1 === 2);
//=> true

console.log('abcd'.split(''));
//=> [ 'a', 'b' ...

console.log('Thats all!');
//=> ... all!

console.log('Line: 155 \nError: Division by zero!');
//=> ... zero ...
```

In the code example above, there are SSPs within those `//=>` comments.

## Pattern Definition

_Simple String Pattern_ (a.k.a. SSP) is **case-sensitive, line-break-escaped** string, with these additional features with a special meaning:

1. Can be surrounded by double quotes `"`, to make its leading and trailing spaces significant.
2. On top on that, it can be surrounded by a _*Partial Mark*_ `...` on either side, to match the beginning, the end or something in the middle of the input.

**SSP Examples**: `Hello \n"World"`, `"Hello \n\"World\""`, <code>"Hello&nbsp;" ...</code>, `... World"`, `... Wo ...`

All of these SSP examples match this multi-line string input:

    Hello
    "World"

## Pattern Nomenclature

Simple String Patterns can be either _loose_ (ignoring leading and trailing whitespaces in the input) or _exact_, using double quotes ("):

1. `abc`: the _Full Loose Pattern_. Matches `abc`, <code>&nbsp;abc</code>, `abc `, <code>&nbsp;abc&nbsp;</code>... Does not match `ABC`, `acc`, `abcd` nor `ab` ...

2. `" abc "`: the _Full Exact Pattern_. Matches <code>&nbsp;abc&nbsp;</code>, but not <code>&nbsp;abc</code>, <code>abc&nbsp;</code> nor <code>abc</code>

Furthermore, patterns can be either _full_ (as were shown above) or _partial_ - matching the _start_, the _end_ or the _middle_ of the string, using three dots (...) as the _Partial Mark_:

1. `abc ...`: The _Start Pattern_. Matches `abc`, `abcd`, <code>abc&nbsp;</code>, but not `abd`, `ab`
2. `... def`: The _End Pattern_. Matches `def`, `abcdef`, <code>&nbsp;def</code>, but not `defg`, `ef`
3. `... abc ...`: The _Middle Pattern_. Matches `abc`, `xabc`, `abcx`, `12abc34`, <code>&nbsp;abc&nbsp;</code>, but not `xabx`, `ab`

Sure we can combine _Exact_/_Loose_ patterns with _Partial Marks_:

1. `... " !"`: the _End Exact Pattern_ (kind of _Partial Exact Pattern_). Matches <code>Hello&nbsp;!</code>, but not `Hello!` nor <code>&nbsp;Hello&nbsp;!&nbsp;</code>.
2. `... ost ...`: the _Middle Loose Pattern_ (kind of Partial Loose Pattern). Matches `ost`, <code>&nbsp;ost&nbsp;</code> , `Most`, <code>Mostly&nbsp;true</code>, but not `os` nor <code>m&nbsp;os&nbsp;t</code>.

### Escapes

Should you match special characters in the pattern string, use escape sequences in the pattern:

`height:\t400`

Double quotes can be escaped:

`\" Hello, \"World\"\"` is equal to `" Hello, "World""`  
Both patterns match the same input <code>&nbsp;Hello, "World"</code>

Escape the backslash character (\\) if you want to use it in the pattern as is:

`c:\\windows\\system` matches the input `c:\windows\system`

### Multi-Line

Having this multi-line input:

     Brown fox
    jumps over a lazy dog.

there are some examples of patterns that match that input:

1. `... lazy ...`
2. `... " dog."`
3. `Brown ...`
4. `... fox\njumps ...`
5. `Brown fox\njumps over a lazy dog.`
6. `" Brown fox\njumps over a lazy dog."`

### Others

Within the _partial pattern_, a space between three dots and pattern body is insignificant, so <code>...&nbsp;abc&nbsp;...</code> pattern equals the `...abc...` one.  
That is, if you want to match leading and/or trailing spaces inside the string, use _Partial Exact Pattern_:  
`... " abc" ...` matches `1 abc2`, `1 abc 2`, but not `1abc2`

## Pattern structure in BNF notation

There is a _Simple String Pattern_ syntax written in [Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form):

for white-spaces, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#white_space

    <simple-string-pattern> ::= <full-pattern> | <partial-pattern>

             <full-pattern> ::= <pattern>

          <partial-pattern> ::= <start-pattern> | <end-pattern> | <middle-pattern>

            <start-pattern> ::= <pattern> <suffix>

              <end-pattern> ::= <prefix> <pattern>

           <middle-pattern> ::= <prefix> <pattern> <suffix>

                   <prefix> ::= <partial-mark> <white-spaces> | <partial-mark>

                   <suffix> ::= <white-spaces> <partial-mark> | <partial-mark>

             <partial-mark> ::= "..."

             <white-spaces> ::= <white-space> | <white-space> <white-spaces>

              <white-space> ::= " " | <TAB> | <VT> | <FF> | <NBSP> | <ZWNBSP> | <USP>

                  <pattern> ::= <exact-pattern> | <loose-pattern>

            <exact-pattern> ::= """ <pattern-body> """

            <loose-pattern> ::= <pattern-body>

             <pattern-body> ::= "" | <char> | <char> <pattern-body>

                     <char> ::= <regular-char> | <escaped-char>

             <regular-char> ::= regular unicode characters, except control characters (line break, CR and so on). Without further explanation

             <escaped-char> ::= "\" <special-char>

             <special-char> ::= """ | "'" | "`" | "\" | "b" | "f" | "n" | "r" | "t"

# simple-string-pattern library

The **simple-string-pattern** library contains an object that encapsulates the SSP and provides methods to create an SSP and test SSP against a string input.

This library is:

- Typed
- With `d.ts` for javascript
- Well tested, with 100% code coverage

## Installation

```bash
$ npm i simple-string-pattern
```

## Usage

### Import

Typescript / ES module:

```ts
import * as SSP from 'simple-string-pattern';
```

Javascript / CommonJS:

```js
const SSP = require('simple-string-pattern');
```

### Create a Pattern

There are two different ways to create an SSP:

#### 1. constructor

SSP constructor expect a string in an SSP format as a parameter:

```js
const patt = new SSP('Hello,\\n "World"!');
```

From the above example, the _patt_ object holds this pattern: `Hello,\n "World"!`

#### 2. parse() method

Static _parse()_ method creates SSP instance from an input string "as is", escaping newlines and other line breaks:

```js
const s = `Hello
 world!`;

const patt = SSP.parse(s);
```

From the above example, the _patt_ object holds this pattern: `Hello\n world!`

### value() method

To get a string representation of the pattern, use the _value()_ method of the SSP object:

```js
const s = `Hello
 world!`;

const patt = SSP.parse(s);

console.log(SSP.value());
//=> Hello\n world!
```

### On SSP objects equality

Two SSP object are considered equal if their pattern string representations are equal:

```js
const s1 = `Hello
 world!`;
const patt1 = SSP.parse(s1);

const s2 = 'Hello\n world!';
const patt2 = SSP.parse(s2);

console.log(s1 === s2);
//=> true
console.log(patt1.value() === patt2.value());
//=> true
console.log(patt1.value());
//=> Hello\n world!
```

Furthermore:

```js
const s3 = 'Hello\\n world!';
const patt3 = new SSP(s3);

console.log(s2 === s3);
//=> false
console.log(patt3.value() === patt1.value());
//=> true
console.log(patt3.value() === patt2.value());
//=> true
console.log(patt3.value());
//=> Hello\n world!
```

### test() method

Returns _true_ if pattern does match the string parameter, _false_ otherwise:

```js
const patt = new SSP('... lazy ...');

console.log(patt.test('See?\nWhat a lazy fox!'));
//=> true
console.log(patt.test('lazy'));
//=> true
console.log(patt.test('See?\nWhat a l-a-z-y fox!'));
//=> false
```

