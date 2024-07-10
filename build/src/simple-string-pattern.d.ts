/**
 * encapsulates the SSP (simple string pattern) and provides
 * methods to create an SSP and test SSP against a string input.
 */
export default class SimpleStringPattern {
    static readonly TYPE_FULL = 0;
    static readonly TYPE_START = 2;
    static readonly TYPE_END = 1;
    static readonly TYPE_MIDDLE = 3;
    private readonly pattern;
    private readonly body;
    private readonly _type;
    private parser;
    /**
     * Creates a new SSP object.
     * @param pattern A string in SSP notation.
     */
    constructor(pattern: string);
    /**
     *
     * @returns a simple string pattern
     */
    value(): string;
    /**
     *
     * @param input a string to match
     * @returns true if this SPP object match that input. False otherwise.
     */
    test(input: string): boolean;
    static parse(input: string): SimpleStringPattern;
}
