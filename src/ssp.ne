# "Simple String Pattern" (SSP) grammar
# Uses a "Nearley Parser" syntax, https://nearley.js.org/

Main  ->
        FULL_PATTERN                {% id %}
      | PARTIAL_PATTERN             {% id %}

# Full Pattern
FULL_PATTERN -> PBODY               {% d => ({ type: "F", ...d[0] }) %}

# Partial pattern
PARTIAL_PATTERN ->
                  START_PATTERN     {% id %}
                | END_PATTERN       {% id %}
                | MIDDLE_PATTERN    {% id %}

START_PATTERN -> PBODY (_):* PMARK                  {% d => ({ type: "S", ...d[0],
                                                        value: `${d[0].value} ${PART_MARK}`}) %}
END_PATTERN -> PMARK (_):* PBODY                    {% d => ({ type: "E", ...d[2],
                                                        value: `${PART_MARK} ${d[2].value}`}) %}
MIDDLE_PATTERN  -> PMARK (_):* PBODY (_):* PMARK    {% d => ({ type: "M", ...d[2],
                                                        value: `${PART_MARK} ${d[2].value} ${PART_MARK}`}) %}

# Pattern Body
# cannot start nor end with a space ( ) nor a dot (.)
PBODY -> TRIMMED_BODY | EXACT_BODY
# no leading or trailing spaces inside this type of pattern body
TRIMMED_BODY ->
        CHAR                                {% ([fst]) => ({ value: fst[0], body: fst[0] }) %}
      | CHAR (EXTENDED_CHAR):* CHAR         {% composeBodyValue(true) %}
      | CHAR (EXTENDED_CHAR):* DQUOTE       {% composeBodyValue(true) %}
      | DQUOTE (EXTENDED_CHAR):* CHAR       {% composeBodyValue(true) %}

# If the exact body type is parsed, the outermost quotes are meant to be omitted in the result.
# It is the way to create the pattern body with leading and/or trailing spaces.
EXACT_BODY -> DQUOTE (EXTENDED_CHAR):* DQUOTE   {% composeBodyValue(false) /*strips outermost double quotes*/ %}

# Double Quote character
DQUOTE -> "\""

# Partial Mark
PMARK -> DOT DOT DOT

# A character inside the pattern's body, i.e. not the first nor the last one.
EXTENDED_CHAR  -> CHAR | _ | DOT | DQUOTE

# Characters allowed in the whole body of the Pattern, even in the first or the last position.
# ASCII chars except: first 19 chars, a space ( ), a double quote ("), a dot (.), and a backslash (\)
CHAR  -> [\u0021]              # ASCII
CHAR  -> [\u0023-\u002D]      # ASCII
CHAR  -> [\u002F-\u005B]      # ASCII
CHAR  -> [\u005D-\u007E]      # ASCII
# non ASCII chars, various alphabets
CHAR  -> [\u0080-\uD7FF]
# non ASCII: some Emojis
CHAR  -> EMOJI_CHAR

# escape sequence
CHAR  -> ESCAPE_SEQ

# space character
_ -> " "

# escape sequences
ESCAPE_SEQ  -> "\\\\" | "\\t" | "\\r" | "\\n" |"\\f" | "\\b" | "\\\"" | "\\'" | "\\`"

# Partial Mark Character
DOT -> "."

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

    const  composeBodyValue = (shouldAddOuterChars) => ([startChar, middleChars, endChar]) => {
        const innerStr = middleChars.join("");
        const fullStr = startChar + innerStr + endChar;
        return { value: fullStr, body: (shouldAddOuterChars ? fullStr : innerStr) }
    }
%}
