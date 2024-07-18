# Simple String Pattern

A **Simple String Pattern** (a.k.a. **SSP**) is a very simple yet well defined pattern format used to match a string.  
A **simple-string-pattern** is also a name of the library to dealing with _Simple String Patterns_, [here](#simple-string-pattern-library) in this document.

Unlike [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions), _Simple String Pattern_ intentionally has only a few features, to be very easy to read and understand.

The motivation to create such a thing as the SSP was the need for a simple pattern format in [Clogtest testing tool](https://github.com/tomaskraus/clogtest), which runs a piece of code and tests the code output against specially commented assertions:

```js
// We expect the output to be 2
console.log(1 + 1);
//=> 2

console.log(1 + 1 === 2);
//=> true

// Here, we only write the beginning of what we expect to be the output
console.log('abcd'.split(''));
//=> [ 'a', 'b' ...

// What the end of the output should look like (including the space at the end.)
console.log('Thats All! ');
//=> ... "All! "

// What the (possibly multi-line) output should contain
console.log('Line: 155 \nError: Division by zero!');
//=> ... zero ...

// In the expected output,
// we can describe common special characters using escape sequences
console.log('a' + String.fromCharCode(9) + '1');
//=> a\t1

// And yes we can go beyond the ASCII:
console.log('絵文字: 😀.');
//=> 絵文字: 😀.
```

In the code example above, there are SSPs within those `//=>` comments.

As you can see, the SSP really is a string that may contain spaces and some escaped characters, optionally double-quoted, possibly surrounded by three dots ("...") on either side.

#### Solid Foundation

From the very beginning, **SSP** format aims to be well defined, hence it has its own [SSP Grammar](#ssp-grammar).

## SSP Examples

- `abc`: Does match the string '`abc`' only.
- `" abc"`: Does match the string '` abc`' only. Double quotes ensure that leading and trailing spaces matter in the matching process. Those outermost double quotes are not part of the matching.
- `\" abc"`: Does match the string '`" abc"`' including those double quotes. The leading backslash (`\`) character cancels the special meaning of the outermost double quotes.
- `abc ...`: Does match any string that starts with '`abc`'.
- `... abc`: Does match any string that ends with '`abc`'.
- `... abc ...`: Does match any string that contains at least one '`abc`'.
- `... " = " ...`: Does match any string that contains at least one (`=`) character having at least one space before and after.
- `... \n ...`: Does match any string that contains at least one _newline_ character.
- `... \\ ...`: Does match any string that contains at least one backslash character (`\`). Note that the _backslash_ character is also escaped.

> All SSPs are _case sensitive_: `abc` does match the string '`abc`' but not the '`ABc`'

## The Great Escape

In this document, SSP examples are written in the way they appear in the console or a file.  
Should you use SSPs as a string literal in javascript, just **double** those backslashes in that literal.

Example: `Hello \n \\backslashes\\!` SSP expression will appear as <code>'Hello&nbsp;\\\\n&nbsp;\\\\\\\\backslashes\\\\\\\\!'</code> string literal in a javascript file. It will match this input:

> <code>Hello&nbsp; </code>  
> <code>&nbsp;\backslashes\!</code>

## Pattern Definition

_Simple String Pattern_ (a.k.a. SSP) is a **trimmed** string with some **escape sequences**, intended to match **multi-line** _input_ in a **case-sensitive** manner.

SSP consist of _Pattern Body_ (i.e. exact string to match), which can be surrounded by a _*Partial Mark*_ (`...`) on either side, to match the beginning, the end or the inside of the possible _input_.  
There must be exactly one space between a _Partial Mark_ and _Pattern Body_.

> **Note**: Only the _Pattern Body_ is matched against the input in the matching process. Partial Marks only tells how to do the match.

A simplified SSP structure (in an [ABNF](https://en.wikipedia.org/wiki/Augmented_Backus%E2%80%93Naur_form)):

```abnf
ssp = [partial-mark space] pattern-body [space partial-mark]
```

The pattern body itself can be surrounded by double quotes (`"`), to make its leading and trailing spaces significant. This outermost double quote pair is not a part of the matching process.

Some special characters (such as the _newline_ one) can be written in an SSP using **escape-sequence**, with a backslash (`\`) as an escape symbol.  
 Escape the backslash itself to use the backslash in an SSP.

> For a complete SSP definition, see the [SSP Grammar](#ssp-grammar) chapter.

## SSP Types:

Depending on where in the pattern the _partial mark_ (`...`) is, the pattern is one of four types:

1. _Full_: `XXX`
2. _Start_: `XXX ...`
3. _End_: `... XXX`
4. _Middle_: `... XXX ...`

Only the _Full Pattern_ matches the input as a whole.

There are some real examples:

1. `Hello\n "World"`: The _Full Pattern_ example. There is only a _Pattern Body_ (`Hello\n "World"`) in the _Full Pattern_, without any _Partial Marks_.  
   This _Full Pattern_ does match the whole string '`Hello\n "World"`'.
2. <code>"Hello&nbsp;" ...</code>: The _Start Pattern_. Consists of a _Pattern Body_ (<code>Hello&nbsp;</code>) and a _Partial Mark_ (`...`) at the end. Here, the _Pattern Body_ is leading-and-trailing-space significant.  
   This _Start Pattern_ match any string that begins with '`Hello `'.
3. `... World"`: The _End Pattern_. With the leading _Partial Mark_, followed by a _Pattern Body_ (`World"`). Being not surrounded by double quotes, the _Pattern Body_ does not preserve leading or trailing spaces.  
   This _End Pattern_ does match any string that ends with '`World"`'.
4. `... Wo ...`: The _Middle Pattern_, with a _Pattern Body_ (`Wo`), surrounded by _Pattern Marks_.  
   This _Middle Pattern_ does match any string that contains the string '`Wo`'.

All of these SSP examples match this multi-line string input:

```
Hello
 "World"
```

## On Double Quotes:

Because of special meaning of double quotes surrouding the pattern body:

- `"abc"`: Does match the string '`abc`' only.
- `"... abc ..."`: Does match the string '`... abc ...`'.

Should we need to match a string surrounded by double quotes, just escape the leading double quote:

- `\"abc"`: Does match the string '`"abc"`' only.

If a pattern body is not completely surrounded by double quotes, that outermost double-quote character is treated as a normal one - i.e. is a part of a search:

- `abc"`: Does match the string '`abc"`' only.
- `"abc`: Does match the string '`"abc`' only.

## Some special SSPs:

- `""` the full empty pattern, does match the empty input only
- `"" ...` the start empty pattern (does match everything)
- `... ""` the end empty pattern (does match everything)
- `... "" ...` the middle empty pattern (does match everything)

## Invalid SSP Examples:

The empty string is not a valid SSP. Use `""` as an SSP that does (and only) match the empty input.

The string <code>&nbsp;hello</code> is not a valid SSP, as it starts with a whitespace, so it is not trimmed.

The string <code>&nbsp;</code> is not a valid SSP, as it starts with a whitespace, so it is not trimmed. Use the full exact pattern to match an input containing spaces at the beginning/end.

The string:

    Hello
    "World"

is not a valid SSP, as it contains an unescaped newline character.

> Tips to fix an invalid SSP:
>
> 1. Enclose it with double_quotes.
> 2. Use escape sequences for control characters, such as `\t` for tabs and `\n` for newlines
> 3. Be sure to escape a backslash `\` if you want to use it as an ordinary character.
> 4. Do not escape characters that don't need to be escaped.

## SSP Grammar

There is a [Simple String Pattern Grammar](./src/ssp.abnf) file, expressed in [ABNF](https://en.wikipedia.org/wiki/Augmented_Backus%E2%80%93Naur_form).

# simple-string-pattern library

The **simple-string-pattern** library contains an object that encapsulates the SSP and provides methods to create an SSP and test SSP against a string input.

This library is:

- Typed, with `d.ts` for javascript
- Well tested, with 100% code coverage

## Installation

```bash
$ npm i simple-string-pattern
```

## Usage

### Import

Typescript / ES module:

```ts
import SSP from 'simple-string-pattern';
```

Javascript / CommonJS:

```js
const SSP = require('simple-string-pattern').default;
```

### Create a Pattern

There are two different ways to create an SSP:

#### 1. constructor

SSP constructor expect a string in an SSP format as a parameter:

```js
const patt = new SSP('Hello,\\n "World"!');
```

From the above example, the _patt_ object holds this pattern: `Hello,\n "World"!`

> SSP constructor throws an _Error_ if its argument is not a valid SSP string.

#### 2. parse() method

_parse()_ static method creates an SSP instance from an input string "as is", escaping newlines and other line breaks:

```js
const s = `Hello
 world!`;

const patt = SSP.parse(s);
// patt points to an SSP object instance
```

From the above example, the _patt_ object holds this pattern: `Hello\n world!`

Unlike SSP constructor, the _parse()_ method can create an empty SSP object from an empty input:

```js
const patt = SSP.parse('');
// patt does match an empty input
```

_SSP.parse()_ method throws an _Error_ if a valid SSP cannot be created from its argument:

```js
SSP.parse(String.fromCharCode(0));
// throws an Error
```

> _Note_: _SSP.parse()_ always returns a _Full Pattern_ SSP object.

### value() method

To get a string representation of the pattern, use the _value()_ method of the SSP object:

```js
const patt = SSP.parse('hello');
console.log(patt.value());
//=> hello

const patt2 = SSP.parse('ab\nc');
console.log(patt2.value());
//=> ab\\nc
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

### limitPatternLen() method

Returns at least "the-same-matching", new SSP object with its body length being less or equal the original object's one.

_value()_ of the SSP object returned can be of "Start Pattern" type.

```js
// squares: array of squared integers from 0 to 14
const squares = new Array(15).fill(null).map((_, i) => i * i);

const pattern = SSP.parse(squares);
console.log(pattern.value());
//=> 0,1,4,9,16,25,36,49,64,81,100,121,144,169,196

const patternShortened = pattern.limitPatternLen(10);
console.log(patternShortened.value());
//=> 0,1,4,9,16 ...

// Both pattern and patternShortened match the original input.
console.log(pattern.test(squares.toString()));
//=> true
console.log(patternShortened.test(squares.toString()));
//=> true
```

_limitPatternLen()_ method throws an _Error_ if its object's pattern type is not _Full Pattern_ or _Start Pattern_:

```js
const patt = new SSP("... That's end.");
const patt2 = patt.limitPatternLen(4); // throws Error
```

For more about pattern types, see the [SSP Types](#ssp-types) chapter.

### On SSP objects equality

Two SSP objects are considered equal if they do match the same inputs.  
If both SSP object holds the same SSP string (available via their _value()_ method), then those two SSP object are equal. However, two SSP object can be equal without having the same SSP string:

```js
const patt1 = new SSP('"abc"');
const patt2 = new SSP('abc');

console.log(patt1.value() === patt2.value());
//=> false
console.log(patt1.test('abc') && patt2.test('abc'));
//=> true
```

The following holds true:

```js
// we assume the patt1 is defined and is a valid SSP object.
const patt3 = new SSP(patt1.value());
console.log(patt1.value() === patt3.value());
//=> true
```
