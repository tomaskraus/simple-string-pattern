import nearley from 'nearley';
import ssp_grammar from '../.temp/ssp';
// import jsStringEscape from 'js-string-escape';
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
  private readonly body: string;
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
    this.body = unescape(res.body);
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
  value() {
    return this.pattern;
  }

  /**
   *
   * @param input a string to match
   * @returns true if this SPP object match that input. False otherwise.
   */
  test(input: string) {
    // console.log(`body: (${this.body}), input: (${input})`);
    switch (this._type) {
      case SimpleStringPattern.TYPE_START:
        return input.startsWith(this.body);
      case SimpleStringPattern.TYPE_END:
        return input.endsWith(this.body);
      case SimpleStringPattern.TYPE_MIDDLE:
        return input.includes(this.body);
      default:
        return this.body === input;
    }
  }

  static parse(input: string) {
    const escapedInput = escape(input, '\'"\\`');
    let dquotedInput = escapedInput;
    if (
      escapedInput.length > 1 &&
      escapedInput.startsWith('"') &&
      escapedInput.endsWith('"')
    ) {
      dquotedInput = `"${escapedInput}"`;
    } else if (escapedInput.startsWith(' ') || escapedInput.endsWith(' ')) {
      dquotedInput = `"${escapedInput}"`;
    }

    // console.log(`escaped: (${input}), (${escapedInput})`);
    return new this(dquotedInput);
  }

  static {}
}
