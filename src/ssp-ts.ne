@preprocessor typescript

# "Simple String Pattern" (SSP) grammar
# Uses a "Nearley Parser" syntax, https://nearley.js.org/
# Some rules are there just to reduce grammar's ambiguity
Main  ->
        FULL_PATTERN                {% id %}
      | PARTIAL_PATTERN             {% id %}

# Full Pattern
FULL_PATTERN -> PBODY               {% ([pbody]) => ({ type: "F", ...pbody }) %}

# Partial pattern
PARTIAL_PATTERN ->
                  START_PATTERN     {% id %}
                | END_PATTERN       {% id %}
                | MIDDLE_PATTERN    {% id %}

START_PATTERN -> PBODY (_):+ PMARK                  {% d => ({ type: "S", ...d[0],
                                                        value: `${d[0].value} ${PART_MARK}`}) %}
END_PATTERN -> PMARK (_):+ PBODY                    {% d => ({ type: "E", ...d[2],
                                                        value: `${PART_MARK} ${d[2].value}`}) %}
MIDDLE_PATTERN  -> PMARK (_):+ PBODY (_):+ PMARK    {% d => ({ type: "M", ...d[2],
                                                        value: `${PART_MARK} ${d[2].value} ${PART_MARK}`}) %}

# Pattern Body
# cannot start nor end with a space ( )
PBODY ->
        SPACE_EXACT_BODY            {% id %}
      | SPACE_TRIMMED_BODY          {% id %}

# If the exact body type is parsed, the outermost quotes are meant to be omitted in the result.
# It is the way to create the pattern body with leading and/or trailing spaces.
SPACE_EXACT_BODY -> DQUOTE  INNER_TEXT  DQUOTE    {% ([ldq, body, pdq]) =>  {
                                                    const pObject = pObjectFromSingle(body) /*strips outermost double-quotes*/
                                                    return { ...pObject, value: ldq + body + pdq } /*surround value with double-quotes*/
                                                    } %}

# no leading or trailing spaces in this type of pattern body
# can start or end with no more than 2 consecutive dots
SPACE_TRIMMED_BODY ->
        CHAR_OR_DQUOTE                            {% pObjectFromSingle %}
      | MAX_2_DOTS                                {% pObjectFromArray %}

      | CHAR_OR_DQUOTE  MAX_2_DOTS                {% pObjectFromArray %}
      | MAX_2_DOTS  CHAR_OR_DQUOTE                {% pObjectFromArray %}
      | MAX_2_DOTS INNER_CHAR_NO_DOT MAX_2_DOTS   {% pObjectFromArray %}

      | BODY_START  INNER_TEXT  BODY_END          {% pObjectFromArray %}
      | BODY_START  INNER_TEXT  DQUOTE            {% pObjectFromArray %}
      | DQUOTE  INNER_TEXT  BODY_END              {% pObjectFromArray %}

BODY_START ->
             CHAR                             {% id %}
            | MAX_2_DOTS  INNER_CHAR_NO_DOT   {% flatten %}

BODY_END ->
             CHAR                             {% id %}
            | INNER_CHAR_NO_DOT  MAX_2_DOTS   {% flatten %}


MAX_2_DOTS ->
             DOT              {% id %}
           | DOT DOT          {% flatten %}

INNER_TEXT -> (INNER_CHAR):*  {% flatten %}

# Double Quote character
DQUOTE -> "\""                {% id %}

CHAR_OR_DQUOTE ->
                 CHAR         {% id %}
               | DQUOTE       {% id %}

# Partial Mark
PMARK -> DOT DOT DOT          {% flatten %}

# A character inside the pattern's body, i.e. not the first nor the last one.
INNER_CHAR  ->
              CHAR            {% id %}
            | RESERVED_CHAR   {% id %}

#inner char except a dot
INNER_CHAR_NO_DOT ->
                    CHAR                    {% id %}
                  | RESERVED_CHAR_NO_DOT    {% id %}

# characters that have a special meaning based on their position in the SSP
RESERVED_CHAR   ->
                  DOT                   {% id %}
                | RESERVED_CHAR_NO_DOT  {% id %}
RESERVED_CHAR_NO_DOT  ->
                        _               {% id %}
                      | DQUOTE          {% id %}


# Characters allowed in the whole body of the Pattern, even in the first or the last position.
# ASCII chars except: first 19 chars, a space ( ), a double quote ("), a dot (.), and a backslash (\)
CHAR  -> [\u0021]           {% id %}
CHAR  -> [\u0023-\u002D]    {% id %}
CHAR  -> [\u002F-\u005B]    {% id %}
CHAR  -> [\u005D-\u007E]    {% id %}
# non ASCII chars, various alphabets
CHAR  -> [\u0080-\uD7FF]    {% id %}
# non ASCII: some Emojis
CHAR  -> EMOJI_CHAR         {% d => id(d).join('') /*compose an emoji character*/ %}

# escape sequence
CHAR  -> ESCAPE_SEQ         {% id %}

# space character
_ -> " "                    {% id %}

# escape sequences
ESCAPE_SEQ  ->
              "\\\\"        {% id %}
            | "\\t"         {% id %}
            | "\\r"         {% id %}
            | "\\n"         {% id %}
            |"\\f"          {% id %}
            | "\\b"         {% id %}
            | "\\\""        {% id %}
            | "\\'"         {% id %}

# Partial Mark Character
DOT -> "."      {% id %}

# Selected Emoji Unicode Blocks (https://www.compart.com/en/unicode/block)
EMOJI_CHAR  ->
              [\uD83C] [\uDF00-\uDFFF]      # Miscellaneous Symbols and Pictographs (part one)
            | [\uD83D] [\uDC00-\uDDFF]      # Miscellaneous Symbols and Pictographs (part two)
            | [\uD83D] [\uDE00-\uDE4F]      # Emoticons
            | [\uD83D] [\uDE80-\uDEFC]      # Transport and Map Symbols
            | [\uD83E] [\uDD00-\uDDFF]      # Supplemental Symbols and Pictographs
            | [\uD83E] [\uDE00-\uDE6D]      # Chess Symbols
            | [\uD83E] [\uDE70-\uDED6]      # Symbols and Pictographs Extended-A

# postprocessor utilities
@{%
    const DOT = ".";
    const PART_MARK = DOT + DOT + DOT;

    const pObjectFromSingle = (d: string | string[]) => {
    const val: string = Array.isArray(d) ? id(d) : d;
    return { value: val, body: val }
  }

    const pObjectFromArray = (arr: string[]) => {
      const val = flatten(arr);
      return { value: val, body: val}
    }

    const flatten = (arr: string[]): string =>
      arr.reduce((acc:string, s: string) => acc + (Array.isArray(s) ? flatten(s) : s), '');
%}
