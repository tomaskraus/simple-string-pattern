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
    private readonly _body;
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
    /**
     * Returns at least "the-same-matching", new SSP object with its body length being less or equal the original object's one.
     * Value() of the SSP object returned can be of "Start Pattern" type.
     * @param maxPatternLength A maximum number of characters new SSP object should contain (unicode).
     *   Note that escape sequences (such as \n, \t, \\\\) count as one character.
     * @returns "The-same-matching" partial pattern if maxPattern length is lower than this SSP object body length.
     *   Returns a copy of original SSP object otherwise.
     * @throws Error if maxPatternLength is negative.
     * @throws Error if the SSP object pattern is either of End Pattern or Middle Pattern type.
     */
    limitPatternLen(maxPatternLength: number): SimpleStringPattern;
    /**
     *
     * @param input Tries to create an SSP object from the input. That SSP does match that input.
     * @returns A new SSP object. Its value is always of a Full Pattern type.
     * @throws Error if cannot create a valid SSP object from the input.
     *
     */
    static parse(input: string): SimpleStringPattern;
    private static _sanitizeBorderSpace;
}
