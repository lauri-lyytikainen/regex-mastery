"use client";

import Header from "@/components/Header";
import { Card } from "@/components/retroui/Card";
import { cn } from "@/lib/utils";
import { TOKEN_CLS, TokenKind } from "@/lib/regexTokenizer";

type Entry = {
  display: string;
  kind: TokenKind;
  name: string;
  description: string;
  example?: string;
};

type Section = {
  title: string;
  entries: Entry[];
};

const sections: Section[] = [
  {
    title: "Anchors",
    entries: [
      { display: "^", kind: "anchor", name: "Start anchor", description: "Matches the start of the string (or line with the m flag)", example: "^Hello" },
      { display: "$", kind: "anchor", name: "End anchor", description: "Matches the end of the string (or line with the m flag)", example: "world$" },
      { display: "\\b", kind: "escape", name: "Word boundary", description: "Zero-width assertion between a word character (\\w) and a non-word character (\\W)", example: "\\bcat\\b" },
      { display: "\\B", kind: "escape", name: "Non-word boundary", description: "Position that is NOT a word boundary", example: "\\Bcat\\B" },
    ],
  },
  {
    title: "Shorthand Classes",
    entries: [
      { display: "\\d", kind: "escape", name: "Digit", description: "Matches any digit character (0–9)", example: "\\d{3}" },
      { display: "\\D", kind: "escape", name: "Non-digit", description: "Matches any character that is NOT a digit (0–9)", example: "\\D+" },
      { display: "\\w", kind: "escape", name: "Word character", description: "Matches a–z, A–Z, 0–9, or underscore", example: "\\w+" },
      { display: "\\W", kind: "escape", name: "Non-word character", description: "Matches any character that is NOT a word character", example: "\\W+" },
      { display: "\\s", kind: "escape", name: "Whitespace", description: "Matches a space, tab, newline, or other whitespace character", example: "\\s+" },
      { display: "\\S", kind: "escape", name: "Non-whitespace", description: "Matches any character that is NOT whitespace", example: "\\S+" },
    ],
  },
  {
    title: "Quantifiers",
    entries: [
      { display: "*", kind: "quantifier", name: "Zero or more (greedy)", description: "Matches 0 or more of the previous token, as many as possible", example: "ab*" },
      { display: "*?", kind: "quantifier", name: "Zero or more (lazy)", description: "Matches 0 or more of the previous token, as few as possible", example: "ab*?" },
      { display: "+", kind: "quantifier", name: "One or more (greedy)", description: "Matches 1 or more of the previous token, as many as possible", example: "ab+" },
      { display: "+?", kind: "quantifier", name: "One or more (lazy)", description: "Matches 1 or more of the previous token, as few as possible", example: "ab+?" },
      { display: "?", kind: "quantifier", name: "Optional", description: "Matches 0 or 1 of the previous token — makes it optional", example: "colou?r" },
      { display: "{n}", kind: "quantifier", name: "Exactly n", description: "Matches exactly n repetitions of the previous token", example: "\\d{4}" },
      { display: "{n,}", kind: "quantifier", name: "At least n", description: "Matches n or more repetitions of the previous token", example: "\\d{2,}" },
      { display: "{n,m}", kind: "quantifier", name: "Between n and m", description: "Matches between n and m repetitions (inclusive) of the previous token", example: "\\d{2,4}" },
    ],
  },
  {
    title: "Groups",
    entries: [
      { display: "(...)", kind: "groupOpen", name: "Capturing group", description: "Groups the expression and captures the matched text for later use or backreferencing", example: "(\\d+)" },
      { display: "(?:...)", kind: "groupOpen", name: "Non-capturing group", description: "Groups the expression without capturing the match — useful for applying quantifiers", example: "(?:ab)+" },
      { display: "(?=...)", kind: "groupOpen", name: "Positive lookahead", description: "Asserts that the pattern ahead is present without consuming characters", example: "foo(?=bar)" },
      { display: "(?!...)", kind: "groupOpen", name: "Negative lookahead", description: "Asserts that the pattern ahead is NOT present", example: "foo(?!bar)" },
      { display: "(?<=...)", kind: "groupOpen", name: "Positive lookbehind", description: "Asserts that the pattern behind is present without consuming characters", example: "(?<=\\$)\\d+" },
      { display: "(?<!...)", kind: "groupOpen", name: "Negative lookbehind", description: "Asserts that the pattern behind is NOT present", example: "(?<!\\$)\\d+" },
    ],
  },
  {
    title: "Character Sets",
    entries: [
      { display: "[abc]", kind: "charClass", name: "Character set", description: "Matches any one of the characters listed inside the brackets", example: "[aeiou]" },
      { display: "[^abc]", kind: "charClass", name: "Negated character set", description: "Matches any single character NOT listed inside the brackets", example: "[^aeiou]" },
      { display: "[a-z]", kind: "charRange", name: "Character range", description: "Matches any character in the specified Unicode range", example: "[a-zA-Z0-9]" },
    ],
  },
  {
    title: "Special Tokens",
    entries: [
      { display: ".", kind: "dot", name: "Wildcard", description: "Matches any single character except a newline (\\n). Use the s flag to include newlines.", example: "a.c" },
      { display: "|", kind: "alternation", name: "Alternation", description: "Matches the expression on the left OR the one on the right", example: "cat|dog" },
    ],
  },
  {
    title: "Escape Sequences",
    entries: [
      { display: "\\n", kind: "escape", name: "Newline", description: "Matches a newline character (line feed, U+000A)" },
      { display: "\\t", kind: "escape", name: "Tab", description: "Matches a horizontal tab character (U+0009)" },
      { display: "\\r", kind: "escape", name: "Carriage return", description: "Matches a carriage return character (U+000D)" },
      { display: "\\.", kind: "escape", name: "Escaped dot", description: "Matches a literal period '.' — escape a metacharacter to match it literally", example: "3\\.14" },
      { display: "\\*", kind: "escape", name: "Escaped asterisk", description: "Matches a literal asterisk '*'", example: "1\\*2" },
      { display: "\\+", kind: "escape", name: "Escaped plus", description: "Matches a literal plus sign '+'", example: "a\\+b" },
      { display: "\\?", kind: "escape", name: "Escaped question mark", description: "Matches a literal question mark '?'", example: "what\\?" },
      { display: "\\(", kind: "escape", name: "Escaped parenthesis", description: "Matches a literal opening parenthesis '('", example: "f\\(x\\)" },
      { display: "\\[", kind: "escape", name: "Escaped bracket", description: "Matches a literal opening bracket '['", example: "arr\\[0\\]" },
      { display: "\\{", kind: "escape", name: "Escaped brace", description: "Matches a literal opening brace '{'", example: "\\{key\\}" },
      { display: "\\\\", kind: "escape", name: "Escaped backslash", description: "Matches a literal backslash '\\' character", example: "C:\\\\Users" },
      { display: "\\^", kind: "escape", name: "Escaped caret", description: "Matches a literal caret '^' character", example: "\\^start" },
      { display: "\\$", kind: "escape", name: "Escaped dollar", description: "Matches a literal dollar sign '$' character", example: "\\$100" },
      { display: "\\|", kind: "escape", name: "Escaped pipe", description: "Matches a literal pipe '|' character", example: "a\\|b" },
    ],
  },
];

function TokenChip({ display, kind }: { display: string; kind: TokenKind }) {
  return (
    <code
      className={cn(
        "inline-block px-1.5 py-0.5 font-mono font-bold text-sm border-2 border-black/20 whitespace-nowrap",
        TOKEN_CLS[kind],
      )}
    >
      {display}
    </code>
  );
}

export default function CheatsheetPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Regex Cheatsheet</h1>
          <p className="text-muted-foreground text-lg">
            A complete reference for regular expression syntax.
          </p>
          <p className="text-muted-foreground text-lg">
            Hover the token chips in the editor for inline descriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="block w-full overflow-hidden">
              <Card.Header className="pb-0 border-b-2 border-black">
                <Card.Title className="mb-0">{section.title}</Card.Title>
              </Card.Header>
              <Card.Content className="p-0">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {section.entries.map((entry, i) => (
                      <tr
                        key={entry.display + i}
                        className="border-b-2 border-black last:border-b-0"
                      >
                        <td className="px-3 py-2.5 w-32 align-middle">
                          <TokenChip display={entry.display} kind={entry.kind} />
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <div className="font-semibold text-foreground text-sm leading-tight">
                            {entry.name}
                          </div>
                          <div className="text-muted-foreground text-xs mt-0.5 leading-snug">
                            {entry.description}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 align-middle text-right hidden sm:table-cell w-28">
                          {entry.example && (
                            <code className="text-xs bg-muted px-1.5 py-0.5 font-mono border-2 border-black/10 whitespace-nowrap">
                              {entry.example}
                            </code>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Content>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
