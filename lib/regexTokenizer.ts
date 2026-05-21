export type TokenKind =
  | "literal"
  | "escape"
  | "dot"
  | "quantifier"
  | "anchor"
  | "groupOpen"
  | "groupClose"
  | "alternation"
  | "charClass"
  | "charRange"
  | "charNeg";

export interface RegexToken {
  kind: TokenKind;
  raw: string;
  description: string;
  children?: RegexToken[];
}

export const TOKEN_CLS: Record<TokenKind, string> = {
  literal:     "text-foreground",
  escape:      "bg-purple-600 text-white",
  dot:         "bg-teal-600 text-white",
  quantifier:  "bg-rose-600 text-white",
  anchor:      "bg-blue-600 text-white",
  groupOpen:   "bg-amber-500 text-black",
  groupClose:  "bg-amber-500 text-black",
  alternation: "bg-orange-500 text-white",
  charClass:   "bg-emerald-700 text-white",
  charRange:   "bg-emerald-600 text-white",
  charNeg:     "bg-red-700 text-white",
};

const ESCAPE_DESC: Record<string, string> = {
  "\\d": "Digit — matches 0–9",
  "\\D": "Non-digit — matches anything except 0–9",
  "\\w": "Word character — matches a–z, A–Z, 0–9, or underscore",
  "\\W": "Non-word character — opposite of \\w",
  "\\s": "Whitespace — matches space, tab, newline, etc.",
  "\\S": "Non-whitespace — opposite of \\s",
  "\\b": "Word boundary — zero-width position between \\w and \\W",
  "\\B": "Non-word boundary — position that is not a word boundary",
  "\\n": "Newline character (line feed, U+000A)",
  "\\t": "Tab character (U+0009)",
  "\\r": "Carriage return (U+000D)",
  "\\.": "Escaped dot — matches a literal '.'",
  "\\*": "Escaped asterisk — matches a literal '*'",
  "\\+": "Escaped plus — matches a literal '+'",
  "\\?": "Escaped question mark — matches a literal '?'",
  "\\(": "Escaped parenthesis — matches a literal '('",
  "\\)": "Escaped parenthesis — matches a literal ')'",
  "\\[": "Escaped bracket — matches a literal '['",
  "\\]": "Escaped bracket — matches a literal ']'",
  "\\{": "Escaped brace — matches a literal '{'",
  "\\}": "Escaped brace — matches a literal '}'",
  "\\\\": "Escaped backslash — matches a literal '\\'",
  "\\^": "Escaped caret — matches a literal '^'",
  "\\$": "Escaped dollar sign — matches a literal '$'",
  "\\|": "Escaped pipe — matches a literal '|'",
};

function escapeDesc(esc: string, inCharClass = false): string {
  const base = ESCAPE_DESC[esc];
  const suffix = inCharClass ? " (inside a character class)" : "";
  if (base) return base + suffix;
  if (/^\\x[\da-f]{2}$/i.test(esc))
    return `Hex escape — matches the character U+00${esc.slice(2).toUpperCase()}${suffix}`;
  if (/^\\u[\da-f]{4}$/i.test(esc))
    return `Unicode escape — matches U+${esc.slice(2).toUpperCase()}${suffix}`;
  if (/^\\\d$/.test(esc))
    return `Backreference — refers to capture group ${esc.slice(1)}${suffix}`;
  return `Escaped character — matches '${esc.slice(1)}' literally${suffix}`;
}

function quantifierDesc(q: string): string {
  const lazy = q.endsWith("?") && q !== "?";
  const base = lazy ? q.slice(0, -1) : q;
  const tail = lazy
    ? ", lazy — matches as few as possible"
    : ", greedy — matches as many as possible";
  if (base === "*") return `Zero or more of the previous token${tail}`;
  if (base === "+") return `One or more of the previous token${tail}`;
  if (base === "?") return "Zero or one of the previous token (makes it optional)";
  const m = base.match(/^\{(\d+)(,(\d+)?)?\}$/);
  if (m) {
    if (!m[2]) return `Exactly ${m[1]} repetition${m[1] === "1" ? "" : "s"}${tail}`;
    if (!m[3]) return `At least ${m[1]} repetitions${tail}`;
    return `Between ${m[1]} and ${m[3]} repetitions${tail}`;
  }
  return `Quantifier: ${q}`;
}

function groupOpenDesc(raw: string): string {
  const map: Record<string, string> = {
    "(":    "Capturing group — captures the matched text for later use",
    "(?:":  "Non-capturing group — groups without saving the match",
    "(?=":  "Positive lookahead — matches if the pattern ahead is present",
    "(?!":  "Negative lookahead — matches if the pattern ahead is absent",
    "(?<=": "Positive lookbehind — matches if the pattern behind is present",
    "(?<!": "Negative lookbehind — matches if the pattern behind is absent",
  };
  return map[raw] ?? `Group: ${raw}`;
}

export const WHITESPACE_GLYPHS: Record<string, string> = {
  " ":  "⎵",
  "\t": "→",
  "\n": "↵",
  "\r": "↵",
};

function literalDesc(ch: string, inCharClass = false): string {
  const glyph = WHITESPACE_GLYPHS[ch];
  const shown = glyph ? `'${glyph}'` : `'${ch}'`;
  const suffix = inCharClass ? " (inside a character class)" : "";
  return `Literal character — matches ${shown} exactly${suffix}`;
}

function tokenizeCharClass(inner: string): RegexToken[] {
  const tokens: RegexToken[] = [];
  let i = 0;

  if (inner.startsWith("^")) {
    tokens.push({ kind: "charNeg", raw: "^", description: "Negation — matches any character NOT listed in this class" });
    i = 1;
  }

  while (i < inner.length) {
    const ch = inner[i];

    if (ch === "\\") {
      const esc = inner.slice(i, i + 2);
      tokens.push({ kind: "escape", raw: esc, description: escapeDesc(esc, true) });
      i += 2;
      continue;
    }

    if (i + 2 < inner.length && inner[i + 1] === "-" && inner[i + 2] !== "]") {
      const r = inner.slice(i, i + 3);
      tokens.push({ kind: "charRange", raw: r, description: `Character range — matches any character from '${inner[i]}' to '${inner[i + 2]}'` });
      i += 3;
      continue;
    }

    // These retain their colours inside [...] to aid learning, but descriptions explain they're literals here
    const literalOverrides: Partial<Record<string, RegexToken>> = {
      ".": { kind: "dot",         raw: ".", description: "Literal dot — inside a character class '.' matches a period, not any character" },
      "*": { kind: "quantifier",  raw: "*", description: "Literal asterisk — inside a character class '*' is just the character '*', not a quantifier" },
      "+": { kind: "quantifier",  raw: "+", description: "Literal plus — inside a character class '+' is just the character '+', not a quantifier" },
      "?": { kind: "quantifier",  raw: "?", description: "Literal question mark — inside a character class '?' is just the character '?', not a quantifier" },
      "|": { kind: "alternation", raw: "|", description: "Literal pipe — inside a character class '|' is just the character '|', not alternation" },
    };

    if (literalOverrides[ch]) {
      tokens.push(literalOverrides[ch]!);
      i++;
      continue;
    }

    tokens.push({ kind: "literal", raw: ch, description: literalDesc(ch, true) });
    i++;
  }

  return tokens;
}

export function tokenize(pattern: string): RegexToken[] {
  const tokens: RegexToken[] = [];
  let i = 0;

  while (i < pattern.length) {
    const ch = pattern[i];

    if (ch === "\\") {
      const esc = pattern.slice(i, i + 2);
      tokens.push({ kind: "escape", raw: esc, description: escapeDesc(esc) });
      i += 2;
      continue;
    }

    if (ch === "[") {
      let j = i + 1;
      if (pattern[j] === "^") j++;
      if (pattern[j] === "]") j++; // ] right after [ (or [^) is a literal, not closing
      while (j < pattern.length && pattern[j] !== "]") {
        if (pattern[j] === "\\") j++;
        j++;
      }
      const raw = pattern.slice(i, j + 1);
      const inner = raw.slice(1, -1);
      tokens.push({
        kind: "charClass",
        raw,
        description: inner.startsWith("^")
          ? "Negated character class — matches any one character NOT in the listed set"
          : "Character class — matches any one character in the listed set",
        children: tokenizeCharClass(inner),
      });
      i = j + 1;
      continue;
    }

    if (ch === "(") {
      let raw = "(";
      if (pattern[i + 1] === "?") {
        if      (pattern[i + 2] === ":")                              raw = "(?:";
        else if (pattern[i + 2] === "=")                              raw = "(?=";
        else if (pattern[i + 2] === "!")                              raw = "(?!";
        else if (pattern[i + 2] === "<" && pattern[i + 3] === "=")   raw = "(?<=";
        else if (pattern[i + 2] === "<" && pattern[i + 3] === "!")   raw = "(?<!";
      }
      tokens.push({ kind: "groupOpen", raw, description: groupOpenDesc(raw) });
      i += raw.length;
      continue;
    }

    if (ch === ")") {
      tokens.push({ kind: "groupClose", raw: ")", description: "End of group — closes the most recently opened group" });
      i++;
      continue;
    }

    if ("*+?".includes(ch)) {
      const raw = pattern[i + 1] === "?" ? ch + "?" : ch;
      tokens.push({ kind: "quantifier", raw, description: quantifierDesc(raw) });
      i += raw.length;
      continue;
    }

    if (ch === "{") {
      const hit = pattern.slice(i).match(/^\{\d+(?:,\d*)?\}\??/);
      if (hit) {
        tokens.push({ kind: "quantifier", raw: hit[0], description: quantifierDesc(hit[0]) });
        i += hit[0].length;
        continue;
      }
    }

    if (ch === "^") { tokens.push({ kind: "anchor",      raw: "^", description: "Start anchor — matches the start of the string (or line with the 'm' flag)" }); i++; continue; }
    if (ch === "$") { tokens.push({ kind: "anchor",      raw: "$", description: "End anchor — matches the end of the string (or line with the 'm' flag)" });   i++; continue; }
    if (ch === ".") { tokens.push({ kind: "dot",         raw: ".", description: "Wildcard — matches any single character except a newline" });                  i++; continue; }
    if (ch === "|") { tokens.push({ kind: "alternation", raw: "|", description: "Alternation — matches the expression on the left OR the one on the right" }); i++; continue; }

    tokens.push({ kind: "literal", raw: ch, description: literalDesc(ch) });
    i++;
  }

  return tokens;
}
