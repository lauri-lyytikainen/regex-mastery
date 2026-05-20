export interface InfoExample {
  code: string;
  note: string;
}

export interface RegexLevel {
  id: number;
  type: "info" | "challenge";
  title: string;
  description: string;
  examples?: InfoExample[];
  hint?: string;
  initialFlags?: string;
  text?: string;
  solutionRegex?: string;
  solutionFlags?: string;
}

export interface RegexChapter {
  id: number;
  title: string;
  concept: string;
  description: string;
  levels: RegexLevel[];
}

export const chapters: RegexChapter[] = [
  {
    id: 1,
    title: "Literals",
    concept: "Exact character matching",
    description:
      "Start from scratch. A regex pattern is just a sequence of characters — the simplest ones match exactly what you type.",
    levels: [
      {
        id: 1,
        type: "info",
        title: "What is Regex?",
        description:
          "A regular expression (regex) is a pattern you write to find text. The engine reads your pattern left to right and highlights every part of the text that matches. The simplest pattern is just the exact characters you want to find.",
        examples: [
          { code: "cat", note: 'Matches the exact three characters "c", "a", "t" — in that order' },
          { code: "hello world", note: "Spaces are characters too. This matches the exact phrase." },
          {
            code: "g  flag",
            note: "The g (global) flag finds ALL matches in the text. Without it, only the first match is returned. Keep it on for these exercises.",
          },
        ],
      },
      {
        id: 2,
        type: "challenge",
        title: "Your First Match",
        description:
          "Type the word 'cat' in the pattern box. The engine will highlight every occurrence in the text.",
        hint: "Type: cat",
        text: "The cat sat on the mat. A cat naps. A CAT runs.",
        solutionRegex: "cat",
        solutionFlags: "g",
      },
      {
        id: 3,
        type: "info",
        title: "Case Sensitivity & the i Flag",
        description:
          "By default, regex is case-sensitive: 'c' and 'C' are different characters and will not match each other. The i (case-insensitive) flag removes this distinction.",
        examples: [
          { code: "cat", note: 'Without /i — only matches "cat", NOT "Cat" or "CAT"' },
          {
            code: "i  flag",
            note: 'With /i — "cat" now matches "cat", "Cat", "CAT", "cAt" — any casing',
          },
          {
            code: "g + i",
            note: "Flags combine. /gi finds ALL matches AND ignores case.",
          },
        ],
      },
      {
        id: 4,
        type: "challenge",
        title: "Case-Insensitive Match",
        description:
          "Match 'hello' in every casing. Type the pattern, then toggle the i flag on using the flag buttons below the input.",
        hint: "Pattern: hello — enable the i flag",
        initialFlags: "g",
        text: "Hello there! HELLO world. hello everyone. hElLo?",
        solutionRegex: "hello",
        solutionFlags: "gi",
      },
      {
        id: 5,
        type: "info",
        title: "Special Characters & Escaping",
        description:
          "Certain characters have special meaning in regex: . * + ? ( ) [ ] { } ^ $ | \\  — they do things beyond matching themselves. To match one of these literally, place a backslash \\ directly before it.",
        examples: [
          {
            code: ".",
            note: "On its own, a dot is a wildcard — it matches ANY single character (covered in Chapter 2)",
          },
          { code: "\\.", note: 'Backslash + dot — now matches a literal "." character only' },
          { code: "\\*", note: 'Matches a literal asterisk "*"' },
          { code: "\\(", note: 'Matches a literal opening parenthesis "("' },
        ],
      },
      {
        id: 6,
        type: "challenge",
        title: "Escaping a Special Character",
        description:
          "Match every literal dot in the text. Remember: a bare dot means 'any character', so you need to escape it.",
        hint: "Use: \\.",
        text: "3.14 is pi. Visit example.com. The end.",
        solutionRegex: "\\.",
        solutionFlags: "g",
      },
    ],
  },
  {
    id: 2,
    title: "Character Classes",
    concept: "\\d  \\w  \\s  .  [abc]",
    description:
      "Instead of matching one specific character, character classes let you match any character from a defined set.",
    levels: [
      {
        id: 7,
        type: "info",
        title: "Shorthand Classes: \\d \\w \\s",
        description:
          "Regex provides shorthand codes, each written as a backslash followed by a letter, that match a whole category of characters at once. Each shorthand matches exactly ONE character from its category.",
        examples: [
          {
            code: "\\d",
            note: "Matches any single digit: 0 1 2 3 4 5 6 7 8 9",
          },
          {
            code: "\\w",
            note: "Matches any single 'word character': letters a–z A–Z, digits 0–9, or underscore _",
          },
          {
            code: "\\s",
            note: "Matches any single whitespace character: a space, a tab, or a newline",
          },
          {
            code: "\\D  \\W  \\S",
            note: "An uppercase letter means the OPPOSITE — non-digit, non-word-char, non-whitespace",
          },
        ],
      },
      {
        id: 8,
        type: "challenge",
        title: "Digits",
        description: "Use \\d to match every individual digit character in the text.",
        hint: "Use: \\d",
        text: "Order #4521 costs $39.99. Call 555-1234.",
        solutionRegex: "\\d",
        solutionFlags: "g",
      },
      {
        id: 9,
        type: "challenge",
        title: "Word Characters",
        description:
          "Use \\w to match every individual word character. Notice it matches letters and digits but skips spaces, punctuation, and symbols.",
        hint: "Use: \\w",
        text: "cat dog 123 $@!",
        solutionRegex: "\\w",
        solutionFlags: "g",
      },
      {
        id: 10,
        type: "challenge",
        title: "Whitespace",
        description:
          "Use \\s to match every whitespace character. The text below contains spaces, a tab (\\t), and a newline (\\n).",
        hint: "Use: \\s",
        text: "one two\tthree\nfour",
        solutionRegex: "\\s",
        solutionFlags: "g",
      },
      {
        id: 11,
        type: "info",
        title: "The Dot Wildcard",
        description:
          "A bare dot . (without a backslash) is a special wildcard that matches any single character — except a newline. It doesn't care what the character is.",
        examples: [
          { code: ".", note: "Matches a, 5, @, space — any single character except \\n" },
          { code: "c.t", note: 'Matches "cat", "cot", "c3t", "c-t", "c t" — any char between c and t' },
          { code: "c\\.t", note: 'Matches only "c.t" — the dot is escaped, so it\'s literal' },
        ],
      },
      {
        id: 12,
        type: "challenge",
        title: "The Dot Wildcard",
        description:
          "Use a dot to match every 3-character sequence that starts with 'c' and ends with 't', regardless of what's in the middle.",
        hint: "Use: c.t",
        text: "cat cut cot c3t c@t c-t",
        solutionRegex: "c.t",
        solutionFlags: "g",
      },
      {
        id: 13,
        type: "info",
        title: "Custom Sets: [ ]",
        description:
          "Square brackets let you define exactly which characters are allowed at one position. The pattern matches any ONE character from your list.",
        examples: [
          { code: "[abc]", note: 'Matches "a", "b", or "c" — exactly one of them' },
          { code: "[aeiou]", note: "Matches any single vowel" },
          {
            code: "[a-z]",
            note: "A hyphen between two characters inside [] means a range — any lowercase letter",
          },
          { code: "[0-9]", note: "Any digit — equivalent to \\d" },
          {
            code: "[^aeiou]",
            note: "A caret ^ as the FIRST character inside [] inverts the set — matches anything NOT listed",
          },
        ],
      },
      {
        id: 14,
        type: "challenge",
        title: "Matching a Set",
        description: "Match every vowel (a, e, i, o, u) in the text using a character class.",
        hint: "Use: [aeiou]",
        text: "The quick brown fox jumps over the lazy dog.",
        solutionRegex: "[aeiou]",
        solutionFlags: "g",
      },
      {
        id: 15,
        type: "challenge",
        title: "Negated Set",
        description:
          "Match every consonant — letters that are not vowels. Use a negated set to exclude both vowels and spaces, leaving only consonants.",
        hint: "Use: [^aeiou\\s] — the ^ negates the set, \\s excludes spaces",
        text: "regex is fun",
        solutionRegex: "[^aeiou\\s]",
        solutionFlags: "g",
      },
    ],
  },
  {
    id: 3,
    title: "Quantifiers",
    concept: "+  *  ?  {n,m}",
    description:
      "Quantifiers control how many times the element directly before them must repeat.",
    levels: [
      {
        id: 16,
        type: "info",
        title: "Quantifiers: + * ?",
        description:
          "By default, each element in a pattern matches exactly once. A quantifier is placed immediately after an element to change how many times it can repeat. The element can be a single character, a shorthand class, or a set.",
        examples: [
          {
            code: "+",
            note: "One or more repetitions. \\d+ matches \"5\", \"42\", \"1000\" — any run of digits",
          },
          {
            code: "*",
            note: "Zero or more repetitions. ha* matches \"h\" (zero a's), \"ha\", \"haa\", \"haaa\"",
          },
          {
            code: "?",
            note: "Zero or one — makes the element optional. u? means the \"u\" may or may not be there",
          },
          {
            code: "colou?r",
            note: 'The "u" is optional — matches both "color" and "colour"',
          },
        ],
      },
      {
        id: 17,
        type: "challenge",
        title: "One or More: +",
        description:
          "Use \\d+ to match complete numbers as whole sequences rather than digit by digit. The + greedily grabs as many digits as possible.",
        hint: "Use: \\d+",
        text: "I have 3 cats, 42 dogs, and 1000 fish.",
        solutionRegex: "\\d+",
        solutionFlags: "g",
      },
      {
        id: 18,
        type: "challenge",
        title: "Optional: ?",
        description:
          "Use ? to make the 'u' optional and match both the American and British spelling with one pattern.",
        hint: "The u is optional: colou?r",
        text: "The color of the colour wheel is debated. What color? What colour?",
        solutionRegex: "colou?r",
        solutionFlags: "g",
      },
      {
        id: 19,
        type: "challenge",
        title: "Zero or More: *",
        description:
          "Use * to match 'h' followed by any number of 'a' characters — including 'h' with no 'a' at all (zero repetitions).",
        hint: "Use: ha*",
        text: "h ha haa haaa haaaa",
        solutionRegex: "ha*",
        solutionFlags: "g",
      },
      {
        id: 20,
        type: "info",
        title: "Exact Counts: {n} and {n,m}",
        description:
          "When + and * are too open-ended, curly braces let you specify a precise number of repetitions. Like quantifiers, they attach to the element immediately before them.",
        examples: [
          {
            code: "\\d{4}",
            note: "Exactly 4 digits — matches \"2024\", does NOT match \"24\" or \"20240\"",
          },
          {
            code: "\\d{2,4}",
            note: "Between 2 and 4 digits (inclusive) — matches \"42\", \"100\", \"9999\"",
          },
          {
            code: "\\d{3,}",
            note: "3 or more digits — a minimum with no upper limit",
          },
          {
            code: "a{3}",
            note: 'Matches exactly "aaa" — three a\'s in a row',
          },
        ],
      },
      {
        id: 21,
        type: "challenge",
        title: "Exact Count: {n}",
        description:
          "Use {4} to match 4-digit year numbers. Single or double-digit numbers like '99' should not match.",
        hint: "Use: \\d{4}",
        text: "Born in 1990, graduated in 2012, class of 99, retiring in 2055.",
        solutionRegex: "\\d{4}",
        solutionFlags: "g",
      },
      {
        id: 22,
        type: "challenge",
        title: "Count Range: {n,m}",
        description:
          "Use {2,4} to match numbers that are exactly 2, 3, or 4 digits long. Single digits and numbers with 5+ digits should not match.",
        hint: "Use: \\d{2,4} — design the text so there are no 5-digit numbers to worry about",
        text: "Scores: 5, 42, 100, 9999",
        solutionRegex: "\\d{2,4}",
        solutionFlags: "g",
      },
    ],
  },
  {
    id: 4,
    title: "Anchors",
    concept: "^  $  \\b",
    description:
      "Anchors match a position in the text — not a character. They add constraints about where a match can start or end.",
    levels: [
      {
        id: 23,
        type: "info",
        title: "Position Anchors: ^ and $",
        description:
          "Everything learned so far matches actual characters. Anchors are different — they match an invisible position and consume no characters. They constrain WHERE in the text a match is allowed.",
        examples: [
          {
            code: "^",
            note: 'Matches the position at the very start of the text. "^cat" only matches "cat" if it is the first thing in the text.',
          },
          {
            code: "$",
            note: 'Matches the position at the very end. "cat$" only matches "cat" at the end of the text.',
          },
          {
            code: "m  flag",
            note: "Multiline — makes ^ match the start of EACH LINE and $ match the end of EACH LINE",
          },
          {
            code: "^The",
            note: 'With /m, matches "The" only at the beginning of a line',
          },
        ],
      },
      {
        id: 24,
        type: "challenge",
        title: "Start of Line: ^",
        description:
          "Match 'The' only when it starts a line. Enable the m flag so ^ applies to each line, not just the whole text.",
        hint: "Use: ^The — enable the m flag",
        text: "The cat sat on the mat.\nThe dog ran past the car.\nA bird called The Raven flew.\nThe fish swam by the rock.\nShe loved The Ocean.\nThe sun set behind The hill.",
        solutionRegex: "^The",
        solutionFlags: "gm",
      },
      {
        id: 25,
        type: "challenge",
        title: "End of Line: $",
        description:
          "Match 'me' only when it ends a line. Enable the m flag.",
        hint: "Use: me$ — enable the m flag",
        text: "match me\nand me\nnot me here\nbut me",
        solutionRegex: "me$",
        solutionFlags: "gm",
      },
      {
        id: 26,
        type: "info",
        title: "Word Boundaries: \\b",
        description:
          "\\b matches the boundary between a word character (\\w) and a non-word character — for example, between a letter and a space, or between a letter and the start/end of text. It is zero-width: it matches a position, not a character.",
        examples: [
          {
            code: "\\b",
            note: "Matches the invisible edge of a word — does not consume any character",
          },
          {
            code: "\\bis\\b",
            note: 'Matches the whole word "is" — but NOT the "is" inside "island" or "history"',
          },
          {
            code: "\\bcat\\b",
            note: 'Matches "cat" as a standalone word, not inside "catfish" or "tomcat"',
          },
          {
            code: "\\bcat",
            note: 'Matches "cat" only at the START of a word — matches "cat" and "catfish", not "tomcat"',
          },
        ],
      },
      {
        id: 27,
        type: "challenge",
        title: "Word Boundary: \\b",
        description:
          "Match the whole word 'is' without also matching it inside 'island', 'history', or 'interesting'.",
        hint: "Use: \\bis\\b",
        text: "This island is where it is. History is interesting.",
        solutionRegex: "\\bis\\b",
        solutionFlags: "g",
      },
      {
        id: 28,
        type: "challenge",
        title: "Whole Lines",
        description:
          "Combine ^ and $ with the m flag to match only lines that consist entirely of digits — nothing else on the line.",
        hint: "Use: ^\\d+$ — enable the m flag",
        text: "12345\nhello\n99\nworld\n42",
        solutionRegex: "^\\d+$",
        solutionFlags: "gm",
      },
    ],
  },
  {
    id: 5,
    title: "Groups & Alternation",
    concept: "|  ( )  (?:)  \\1",
    description:
      "Groups let you treat multiple characters as one unit. Alternation lets you express choices. Together they unlock powerful structural patterns.",
    levels: [
      {
        id: 29,
        type: "info",
        title: "Alternation: |",
        description:
          "The pipe character | means 'or'. The engine tries to match the left side; if that fails, it tries the right side. By default, | has very low precedence — it splits the entire pattern unless you use parentheses to limit its scope.",
        examples: [
          { code: "cat|dog", note: 'Matches either "cat" or "dog"' },
          { code: "yes|no|maybe", note: "Matches any one of three options" },
          {
            code: "I like cat|dogs",
            note: 'Low precedence: matches "I like cat" OR "dogs" — probably not what you want',
          },
          {
            code: "I like (cat|dog)s",
            note: 'With parentheses: matches "I like cats" OR "I like dogs" — | scoped to the group',
          },
        ],
      },
      {
        id: 30,
        type: "challenge",
        title: "Alternation",
        description: "Match either 'cat' or 'dog' anywhere in the text.",
        hint: "Use: cat|dog",
        text: "I have a cat and a dog. The cat is sleeping. The dog is barking.",
        solutionRegex: "cat|dog",
        solutionFlags: "g",
      },
      {
        id: 31,
        type: "info",
        title: "Capturing Groups: ( )",
        description:
          "Parentheses group part of a pattern AND remember (capture) whatever they matched. Each group is automatically numbered from left to right.",
        examples: [
          {
            code: "(cat|dog)",
            note: "Groups the alternation AND saves the matched word as group 1",
          },
          {
            code: "(\\w+)@(\\w+)",
            note: "Two groups — group 1 captures the username, group 2 the domain",
          },
          {
            code: "(?:cat|dog)",
            note: "(?:...) is a non-capturing group — it groups without saving. Use it when you only need grouping, not the saved value.",
          },
          {
            code: "\\1",
            note: "Backreference — matches exactly what group 1 captured. (\\w+) \\1 matches 'hello hello'.",
          },
        ],
      },
      {
        id: 32,
        type: "challenge",
        title: "Capturing Groups",
        description:
          "Use a capturing group with alternation to match abbreviated month names followed by a space and a 4-digit year.",
        hint: "Use: (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d{4}",
        text: "Jan 2020, Feb 2021, March 2022, Apr 2023, December 2024",
        solutionRegex: "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d{4}",
        solutionFlags: "g",
      },
      {
        id: 33,
        type: "challenge",
        title: "Non-Capturing Groups",
        description:
          "Use (?:ha) to group 'ha' without capturing it, then + to repeat the group one or more times.",
        hint: "Use: (?:ha)+",
        text: "ha haha hahaha hahahaha",
        solutionRegex: "(?:ha)+",
        solutionFlags: "g",
      },
      {
        id: 34,
        type: "challenge",
        title: "Backreferences",
        description:
          "Match words that appear twice consecutively. Capture the first word, then use \\1 to require the same word again.",
        hint: "Use: (\\w+) \\1",
        text: "the the cat cat sat on on the mat mat",
        solutionRegex: "(\\w+) \\1",
        solutionFlags: "g",
      },
    ],
  },
  {
    id: 6,
    title: "Lookarounds",
    concept: "(?=)  (?!)  (?<=)  (?<!)",
    description:
      "Lookarounds let you match based on what surrounds a position — without including that surrounding context in the match itself.",
    levels: [
      {
        id: 35,
        type: "info",
        title: "Lookaheads: (?=) and (?!)",
        description:
          "A lookahead checks what comes immediately after the current match position. It is zero-width — the engine peeks ahead but does not consume any characters. The lookahead content is checked but never appears in the match result.",
        examples: [
          {
            code: "(?=abc)",
            note: 'Positive lookahead: the current position only matches if "abc" follows',
          },
          {
            code: "(?!abc)",
            note: 'Negative lookahead: the current position only matches if "abc" does NOT follow',
          },
          {
            code: "\\d+(?=px)",
            note: '"100px" → matches "100". The "px" is required to be there but is not part of the result.',
          },
          {
            code: "cat(?!s)",
            note: 'Matches "cat" in "catnip" and "category", but NOT in "cats" (followed by "s")',
          },
        ],
      },
      {
        id: 36,
        type: "challenge",
        title: "Positive Lookahead",
        description:
          "Match only the numbers that are immediately followed by 'px'. The 'px' should not appear in the match.",
        hint: "Use: \\d+(?=px)",
        text: "width: 100px; height: 200px; margin: 10%; z-index: 5;",
        solutionRegex: "\\d+(?=px)",
        solutionFlags: "g",
      },
      {
        id: 37,
        type: "challenge",
        title: "Negative Lookahead",
        description:
          "Match 'cat' only when it is NOT immediately followed by 's'. Should match in 'cat', 'catnip', and 'category' — but not 'cats'.",
        hint: "Use: cat(?!s)",
        text: "cat cats catnip category scatter",
        solutionRegex: "cat(?!s)",
        solutionFlags: "g",
      },
      {
        id: 38,
        type: "info",
        title: "Lookbehinds: (?<=) and (?<!)",
        description:
          "A lookbehind checks what came immediately before the current position — without including it in the match. Same idea as lookaheads, but looking backwards.",
        examples: [
          {
            code: "(?<=abc)",
            note: 'Positive lookbehind: only matches positions preceded by "abc"',
          },
          {
            code: "(?<!abc)",
            note: 'Negative lookbehind: only matches positions NOT preceded by "abc"',
          },
          {
            code: "(?<=\\$)\\d+",
            note: '"$42" → matches "42". The "$" must precede the digits but is not in the result.',
          },
          {
            code: "(?<!\\d)\\d{3}",
            note: "Matches 3 digits only when not preceded by another digit",
          },
        ],
      },
      {
        id: 39,
        type: "challenge",
        title: "Positive Lookbehind",
        description:
          "Match numbers that come immediately after a '$' sign. The dollar sign itself should not appear in the match.",
        hint: "Use: (?<=\\$)\\d+",
        text: "Price: $42, Discount: $5, Total: $37, Items: 3, Code: 100",
        solutionRegex: "(?<=\\$)\\d+",
        solutionFlags: "g",
      },
    ],
  },
];

export function getAllLevels(): RegexLevel[] {
  return chapters.flatMap((c) => c.levels);
}

export function getChapterForLevel(levelId: number): RegexChapter | undefined {
  return chapters.find((c) => c.levels.some((l) => l.id === levelId));
}
