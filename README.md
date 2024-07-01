# Simple String Pattern

A **Simple String Pattern** (a.k.a. **SSP**) is a very simple pattern used to match a string.  
A **simple-string-pattern** is also a name of the library to dealing with _Simple String Patterns_, [here](#simple-string-pattern-library) in this document.

Unlike [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions), _Simple String Pattern_ intentionally has only a few features, to be very easy to read and understand.

The motivation to create such a thing as the SSP was the need for writing a [Doctest](https://docs.python.org/3/library/doctest.html)-like testing tool, where user can write string output assertions right into code comments, in a convenient way:

```js
// We expect the output to be 2
console.log(1 + 1);
//=> 2

console.log(1 + 1 === 2);
//=> true

// Here, we only write the beginning of what we expect to be the output
console.log('abcd'.split(''));
//=> [ 'a', 'b' ...

// What the end of the output should look like
console.log('Thats All! ');
//=> ... "All! "

// What the (possibly multi-line) output should contain
console.log('Line: 155 \nError: Division by zero!');
//=> ... zero ...
```

In the code example above, there are SSPs within those `//=>` comments.

As you see, the SSP really is a string that may contain spaces and some escaped characters, optionally double-quoted, possibly surrounded by three dots ("...") on either side.

## Basic SSP Examples

- `abc`: Does match the string 'abc' only.
- `" abc"`: Does match the string ' abc' only. Double quotes ensure that leading and trailing spaces are significant.
- `abc ...`: Does match any string that starts with 'abc'.
- `... abc`: Does match any string that ends with 'abc'.
- `... abc ...`: Does match any string that contains at least one 'abc'.
- `... " abc" ...`: Does match any string that contains at least one ' abc'.
- `... \n ...`: Does match any string that contains at least one newline character (i.e. expect the output to be multi-line one).
- `... \\ ...`: Does match any string that contains at least one backslash character.

## The Great Escape

In this document, SSP examples are written in the way they appear in the console or a file.  
Should you use SSPs as a string literal in javascript, just **double** those backslashes in that literal.

Example: `Hello \n \\backslashes\\!` SSP written in a file becomes a <code>'Hello&nbsp;\\\\n&nbsp;\\\\\\\\backslashes\\\\\\\\!'</code> SSP string literal.

## Pattern Definition

_Simple String Pattern_ (a.k.a. SSP) is a **trimmed** string with some **escape sequences**, intended to match **multi-line** _input_ in a **case-sensitive** manner.

SSP consist of _Pattern Body_ (i.e. exact string to match), which can be surrounded by a _*Partial Mark*_ (`...`) on either side, to match the beginning, the end or the inside of the possible _input_.  
Spaces between pattern body and partial mark are insignificant.

The pattern body itself can start and end with double quote (`"`), to make its leading and trailing spaces significant.

Some special characters (such as the newline) can be written in an SSP using **escape-sequence**, with a backslash (`\`) as an escape symbol.  
 Escape the backslash itself to use the backslash in an SSP.

> For an exact SSP definition, see the [Pattern Grammar](#pattern-grammar) chapter.

#### SSP Examples:

1. `Hello\n "World"`: The _Full pattern_ example. There is only a pattern body (`Hello\n "World"`) in the _Full Pattern_, without any partial marks.
2. <code>"Hello&nbsp;" ...</code>: The _Start pattern_. Consists of a pattern body (<code>Hello&nbsp;</code>) and a partial mark (`...`) at the end. Here, the pattern body is leading-and-trailing-space significant.
3. `... World"`: The _End pattern_. With the leading partial mark, followed by a pattern body (`World"`). Being not surrounded by double quotes, the pattern body does not contain significant leading or trailing spaces.
4. `... Wo ...`: The _Middle pattern_, with a pattern body (`Wo`), surrounded by pattern marks.

All of these SSP examples match this multi-line string input:

```
Hello
 "World"
```

##### On Double Quotes:

Because of special meaning of double quotes surrouding the pattern body:

- `"abc"`: Does match the string 'abc' only.
- `"... abc ..."`: Does match the string '... abc ...'.

Should we need to match a string surrounded by double quotes, double them in the SSP:

- `""abc""`: Does match the string '"abc"' only.

or escape those double quotes at the beginning and end:

- `\"abc\"`: Also does match the string '"abc"' only.

##### Some special SSPs:

- `""` full empty pattern (does match the empty input only)
- `""...` start empty pattern (does match everything)
- `...""` end empty pattern (does match everything)
- `...""...` middle empty pattern (does match everything)

#### Non SSP Examples:

The empty string is not a valid SSP. Use `""` as an SSP that does (and only) match the empty input.

The string <code>&nbsp;hello</code> is not a valid SSP, as it starts with a whitespace, so it is not trimmed.

The string <code>&nbsp;</code> is not a valid SSP, as it starts with a whitespace, so it is not trimmed. Use the full exact pattern to match an input containing spaces at the beginning/end.

The string:

    Hello
    "World"

is not a valid SSP, as it contains an unescaped newline character.

The string `.` is not a valid SSP, nor any string consisting of space and dot characters only.  
To create valid SSPs for those strings, enclose them in double quotes:

1. `"."`: Does match an input of one dot.
2. `... " . " ...`: Does match an input that contains at least one dot surrounded by a space character.
3. `"..."`: Does match three dots.

## Pattern Grammar

There is a [Simple String Pattern syntax](./src/ssp.ne) document written for [Nearley Parser](https://nearley.js.org/). This document serves as single source of truth.

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

Two SSP objects are considered equal if their pattern string representations (available via their _value()_ method) are equal:

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

console.log(s2 === s3); // these strings used to create SSP are not equal...
//=> false
console.log(patt3.value() === patt1.value()); // ...but resulting SSPs could.
//=> true
console.log(patt3.value() === patt2.value());
//=> true
console.log(patt3.value());
//=> Hello\n world!
```

The following holds true:

```js
const patt1 = new SSP('hello');
const patt2 = new SSP(patt1.value());

console.log(patt1.value() === patt2.value());
//=> true
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
