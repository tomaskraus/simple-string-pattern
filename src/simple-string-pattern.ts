import nearley from 'nearley';
import ssp_grammar from '#src/ssp-ts';
import {escape, unescape} from 'safe-string-literal';

/**
 * encapsulates the SSP (simple string pattern) and provides
 * methods to create an SSP and test SSP against a string input.
 */
export default class SimpleStringPattern {
  public static readonly TYPE_FULL = 0b00;
  public static readonly TYPE_START = 0b10;
  public static readonly TYPE_END = 0b01;
  public static readonly TYPE_MIDDLE = 0b11;

  private readonly pattern: string;
  private readonly _body: string;
  private readonly _type: number;

  private parser: nearley.Parser;

  /**
   * Creates a new SSP object.
   * @param pattern A string in SSP notation.
   */
  constructor(pattern: string) {
    this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(ssp_grammar));
    this.parser.feed(pattern);
    if (this.parser.results.length === 0) {
      throw new Error(`Parser: pattern not recognized: (${pattern})`);
    }
    const res = this.parser.results[0];
    // console.log('ssp parsed', res);
    this.pattern = res.value;
    this._body = unescape(res.body);
    switch (res.type) {
      case 'S':
        this._type = SimpleStringPattern.TYPE_START;
        break;
      case 'E':
        this._type = SimpleStringPattern.TYPE_END;
        break;
      case 'M':
        this._type = SimpleStringPattern.TYPE_MIDDLE;
        break;
      default:
        this._type = SimpleStringPattern.TYPE_FULL;
    }
  }

  /**
   *
   * @returns a simple string pattern
   */
  public value() {
    return this.pattern;
  }

  /**
   *
   * @param input a string to match
   * @returns true if this SPP object match that input. False otherwise.
   */
  public test(input: string) {
    // console.log(`body: (${this.body}), input: (${input})`);
    switch (this._type) {
      case SimpleStringPattern.TYPE_START:
        return input.startsWith(this._body);
      case SimpleStringPattern.TYPE_END:
        return input.endsWith(this._body);
      case SimpleStringPattern.TYPE_MIDDLE:
        return input.includes(this._body);
      default:
        return this._body === input;
    }
  }

  /**
   *
   * @param input Tries to create an SSP object from the input. That SSP does match that input.
   * @returns A new SSP object. Its value is always of a Full Pattern type.
   * @throws Error if cannot create a valid SSP object from the input.
   *
   */
  public static parse(input: string) {
    if (input.length === 0) {
      return new this('""');
    }
    const escapedInput = escape(input, '\'"`');
    let dquotedInput = escapedInput;
    if (
      escapedInput.length > 1 &&
      escapedInput.startsWith('"') &&
      escapedInput.endsWith('"')
    ) {
      dquotedInput = `"${escapedInput}"`;
    } else {
      dquotedInput = this._sanitizeBorderSpace(dquotedInput);
    }

    // console.log(`escaped: (${input}), (${escapedInput})`);
    return new this(dquotedInput);
  }

  private static _sanitizeBorderSpace(str: string) {
    if (str.startsWith(' ') || str.endsWith(' ')) {
      return `"${str}"`;
    }
    return str;
  }

  static {}
}
