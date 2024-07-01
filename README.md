# Simple String Pattern

A **Simple String Pattern** (a.k.a. **SSP**) is a very simple yet well defined pattern format used to match a string.  
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
console.log("abcd".split(""));
//=> [ 'a', 'b' ...

// What the end of the output should look like (including the space at the end.)
console.log("Thats All! ");
//=> ... "All! "

// What the (possibly multi-line) output should contain
console.log("Line: 155 \nError: Division by zero!");
//=> ... zero ...

// In the expected output,
// we can describe common special characters using escape sequences
console.log("a" + String.fromCharCode(9) + "1");
//=> a\t1

// And yes we can go beyond the ASCII:
console.log("絵文字: 😀");
//=> 絵文字: 😀
```

In the code example above, there are SSPs within those `//=>` comments.

As you can see, the SSP really is a string that may contain spaces and some escaped characters, optionally double-quoted, possibly surrounded by three dots ("...") on either side.

#### Solid Background

From the very beginning, **SSP** format aims to be well defined, hence it has its own [SSP Grammar](#ssp-grammar).

## Basic SSP Examples

- `abc`: Does match the string '`abc`' only.
- `" abc"`: Does match the string '` abc`' only. Double quotes ensure that leading and trailing spaces are significant. Those outer double quotes are not part of the search.
- `"" abc""`: Does match the string '`" abc"`' only.
- `abc ...`: Does match any string that starts with '`abc`'.
- `... abc`: Does match any string that ends with '`abc`'.
- `... abc ...`: Does match any string that contains at least one '`abc`'.
- `... " a"b"c" ...`: Does match any string that contains at least one '` a"b"c`'.
- `... \n ...`: Does match any string that contains at least one newline character (i.e. expect the output to be multi-line one).
- `... \\ ...`: Does match any string that contains at least one backslash character (`\`). In SSP, some special characters use escape sequence, so does the backslash character itself.

## The Great Escape

In this document, SSP examples are written in the way they appear in the console or a file.  
Should you use SSPs as a string literal in javascript, just **double** those backslashes in that literal.

Example: `Hello \n \\backslashes\\!` SSP written in a file becomes a <code>'Hello&nbsp;\\\\n&nbsp;\\\\\\\\backslashes\\\\\\\\!'</code> SSP string literal.

## Pattern Definition

_Simple String Pattern_ (a.k.a. SSP) is a **trimmed** string with some **escape sequences**, intended to match **multi-line** _input_ in a **case-sensitive** manner.

SSP consist of _Pattern Body_ (i.e. exact string to match), which can be surrounded by a _*Partial Mark*_ (`...`) on either side, to match the beginning, the end or the inside of the possible _input_.  
Spaces between pattern body and partial mark are insignificant.

A simplified SSP structure (in an [ABNF](https://en.wikipedia.org/wiki/Augmented_Backus%E2%80%93Naur_form)):

```abnf
ssp = [partial-mark] pattern-body [partial-mark]
```

The pattern body itself can start and end with double quote (`"`), to make its leading and trailing spaces significant.

Some special characters (such as the newline) can be written in an SSP using **escape-sequence**, with a backslash (`\`) as an escape symbol.  
 Escape the backslash itself to use the backslash in an SSP.

> For a complete SSP definition, see the [SSP Grammar](#ssp-grammar) chapter.

## SSP Types:

Depending on where in the pattern the partial mark is, the pattern is one of four types: _Full_, _Start_, _End_ and _Middle_.  
Only the _Full_ pattern matches the input as a whole.

1. `Hello\n "World"`: The _Full Pattern_ example. There is only a _Pattern Body_ (`Hello\n "World"`) in the _Full Pattern_, without any _Partial Marks_.  
   This _Full Pattern_ does match the whole string '`Hello\n "World"`'.
2. <code>"Hello&nbsp;" ...</code>: The _Start Pattern_. Consists of a _Pattern Body_ (<code>Hello&nbsp;</code>) and a _Partial Mark_ (`...`) at the end. Here, the _Pattern Body_ is leading-and-trailing-space significant.  
   This _Start Pattern_ match any string that begins with '`Hello `'.
3. `... World"`: The _End Pattern_. With the leading _Partial Mark_, followed by a _Pattern Body_ (`World"`). Being not surrounded by double quotes, the _Pattern Body_ does not contain significant leading or trailing spaces.  
   This _End Pattern_ does match any string that ends with '`World"`'.
4. `... Wo ...`: The _Middle Pattern_, with a _Pattern Body_ (`Wo`), surrounded by _Pattern Marks_.  
   This _Middle Pattern_ does match any string that contains the string '`Wo`'.

All of these SSP examples match this multi-line string input:

```
Hello
 "World"
```

#### On Double Quotes:

Because of special meaning of double quotes surrouding the pattern body:

- `"abc"`: Does match the string '`abc`' only.
- `"... abc ..."`: Does match the string '`... abc ...`'.

Should we need to match a string surrounded by double quotes, double them in the SSP:

- `""abc""`: Does match the string '`"abc"`' only.

or escape those double quotes at the beginning and end:

- `\"abc\"`: Also does match the string '`"abc"`' only.

#### Some special SSPs:

- `""` full empty pattern (does match the empty input only)
- `""...` start empty pattern (does match everything)
- `...""` end empty pattern (does match everything)
- `...""...` middle empty pattern (does match everything)
- `..."..."...` middle pattern that does match any string containing three consecutive dots

#### Invalid SSP Examples:

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

## SSP Grammar

There is a [Simple String Pattern Grammar](./src/ssp.ne) file that can be processed by [Nearley Parser](https://nearley.js.org/). That grammar file serves as a single source of truth.

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
import * as SSP from "simple-string-pattern";
```

Javascript / CommonJS:

```js
const SSP = require("simple-string-pattern");
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
const s = `...Hello
 world!`;

const patt = SSP.parse(s);

console.log(SSP.value());
//=> "... Hello\n world!"
```

### On SSP objects equality

Two SSP objects are considered equal if their pattern string representations (available via their _value()_ method) are equal:

```js
const s1 = `Hello
 world!`;
const patt1 = SSP.parse(s1);

const s2 = "Hello\n world!";
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
const s3 = "Hello\\n world!";
const patt3 = new SSP(s3);

console.log(s2 === s3); // these strings used to create SSP are not equal...
//=> false
console.log(patt3.value() === patt1.value()); // ...although, resulting SSPs could.
//=> true
console.log(patt3.value() === patt2.value());
//=> true
console.log(patt3.value());
//=> Hello\n world!
```

The following holds true:

```js
const patt1 = new SSP("hello");
const patt2 = new SSP(patt1.value());
console.log(patt1.value() === patt2.value());
//=> true
```

### test() method

Returns _true_ if pattern does match the string parameter, _false_ otherwise:

```js
const patt = new SSP("... lazy ...");

console.log(patt.test("See?\nWhat a lazy fox!"));
//=> true
console.log(patt.test("lazy"));
//=> true
console.log(patt.test("See?\nWhat a l-a-z-y fox!"));
//=> false
```
