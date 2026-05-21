"use client";

import { useState, useMemo, ChangeEvent, ReactNode } from "react";
import Header from "@/components/Header";
import { Input } from "@/components/retroui/Input";
import { Textarea } from "@/components/retroui/Textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/retroui/ToggleGroup";
import { Tooltip } from "@/components/retroui/Tooltip";
import { Card } from "@/components/retroui/Card";
import { Badge } from "@/components/retroui/Badge";
import { TokenSpan } from "@/components/TokenSpan";
import { tokenize, TOKEN_CLS, RegexToken, WHITESPACE_GLYPHS } from "@/lib/regexTokenizer";
import { compilePattern, getMatches } from "@/lib/regexUtils";
import { FLAG_LIST, FLAG_DESCRIPTIONS, type Flag } from "@/lib/flags";
import { cn } from "@/lib/utils";

const DEFAULT_TEXT = `The quick brown fox jumps over the lazy dog.
Pack my box with five dozen liquor jugs.
How vexingly quick daft zebras jump!`;

function displayRaw(raw: string): string {
  return WHITESPACE_GLYPHS[raw] ?? raw;
}

function buildTree(tokens: RegexToken[]): RegexToken[] {
  const result: RegexToken[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.kind === "groupOpen") {
      let depth = 1;
      let j = i + 1;
      while (j < tokens.length && depth > 0) {
        if (tokens[j].kind === "groupOpen") depth++;
        if (tokens[j].kind === "groupClose") depth--;
        j++;
      }
      const innerTokens = tokens.slice(i + 1, j - 1);
      const closeToken = tokens[j - 1];
      const children = [...buildTree(innerTokens), ...(closeToken ? [closeToken] : [])];
      result.push({ ...token, children });
      i = j;
    } else {
      // groupClose tokens are consumed above; anything else passes through
      result.push(token);
      i++;
    }
  }
  return result;
}

function TokenRow({ token }: { token: RegexToken }) {
  return (
    <div>
      <div className="flex items-start gap-3 py-2">
        <code
          className={cn(
            "inline-block px-1.5 py-0.5 font-mono font-bold text-sm border-2 border-black/20 whitespace-nowrap shrink-0 mt-0.5 min-w-[1.75rem] text-center",
            TOKEN_CLS[token.kind],
          )}
        >
          {displayRaw(token.raw)}
        </code>
        <span className="text-sm text-muted-foreground leading-snug">
          {token.description}
        </span>
      </div>
      {token.children && token.children.length > 0 && (
        <div className="ml-3 pl-3 border-l-2 border-border">
          {token.children.map((child, i) => (
            <TokenRow key={`${child.kind}-${child.raw}-${i}`} token={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlaygroundPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Flag[]>(["g"]);
  const [testText, setTestText] = useState(DEFAULT_TEXT);

  const flagString = flags.join("");

  const compiled = useMemo(
    () => compilePattern(pattern, flagString),
    [pattern, flagString],
  );

  const matches = useMemo(() => {
    if (!pattern || !compiled.regex) return [];
    return getMatches(testText, compiled.regex);
  }, [pattern, compiled.regex, testText]);

  const patternTokens = useMemo(() => tokenize(pattern), [pattern]);
  const tokenTree = useMemo(() => buildTree(patternTokens), [patternTokens]);

  const highlighted = useMemo((): ReactNode[] => {
    if (!matches.length) return [<span key="text">{testText}</span>];
    const out: ReactNode[] = [];
    let cursor = 0;
    matches.forEach((m, i) => {
      if (m.start > cursor)
        out.push(<span key={`t-${i}`}>{testText.slice(cursor, m.start)}</span>);
      out.push(
        <span
          key={`m-${i}`}
          className="bg-primary/50 rounded-sm mx-0.5 ring-1 ring-primary"
        >
          {testText.slice(m.start, m.end)}
        </span>,
      );
      cursor = m.end;
    });
    if (cursor < testText.length)
      out.push(<span key="t-end">{testText.slice(cursor)}</span>);
    return out;
  }, [testText, matches]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Regex Playground</h1>
          <p className="text-muted-foreground text-lg">
            Test and explore regular expressions interactively.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left column: pattern editor + test string + match view */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Pattern card */}
            <Card>
              <Card.Header className="border-b-2 border-black pb-3">
                <Card.Title>Pattern</Card.Title>
              </Card.Header>
              <Card.Content className="pt-4 flex flex-col gap-3">

                {/* /pattern/ input */}
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-mono text-xl font-bold select-none">/</span>
                  <Input
                    value={pattern}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPattern(e.target.value)
                    }
                    placeholder="Enter regex pattern…"
                    className="font-mono flex-1"
                    aria-invalid={!!compiled.error}
                  />
                  <span className="text-muted-foreground font-mono text-xl font-bold select-none">/</span>
                </div>

                {/* Flags + match count */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Tooltip.Provider>
                    <ToggleGroup
                      type="multiple"
                      value={flags}
                      onValueChange={(vals) =>
                        setFlags(
                          vals.filter((v): v is Flag =>
                            (FLAG_LIST as readonly string[]).includes(v),
                          ),
                        )
                      }
                    >
                      {FLAG_LIST.map((f) => (
                        <Tooltip key={f}>
                          <Tooltip.Trigger asChild>
                            <ToggleGroupItem
                              value={f}
                              size="sm"
                              variant={flags.includes(f) ? "outlined" : "default"}
                            >
                              {f}
                            </ToggleGroupItem>
                          </Tooltip.Trigger>
                          <Tooltip.Content side="top">
                            {FLAG_DESCRIPTIONS[f]}
                          </Tooltip.Content>
                        </Tooltip>
                      ))}
                    </ToggleGroup>
                  </Tooltip.Provider>

                  {pattern && !compiled.error && (
                    <Badge
                      size="sm"
                      className={
                        matches.length > 0
                          ? "bg-yellow-400 text-black border-2 border-black"
                          : "border-2 border-black"
                      }
                    >
                      {matches.length > 0
                        ? `${matches.length} match${matches.length !== 1 ? "es" : ""}`
                        : "No matches"}
                    </Badge>
                  )}
                </div>

                {/* Error */}
                {compiled.error && (
                  <p role="alert" className="text-destructive text-sm">
                    {String(compiled.error.message || compiled.error)}
                  </p>
                )}

                {/* Token visualization */}
                {patternTokens.length > 0 && (
                  <Tooltip.Provider
                    delayDuration={0}
                    skipDelayDuration={0}
                    disableHoverableContent
                  >
                    <div className="flex items-center flex-wrap gap-1.5 text-sm">
                      <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                        Tokens:
                      </span>
                      <code className="px-1 py-0.5 rounded bg-muted text-sm inline-flex items-center flex-wrap gap-y-0.5">
                        {patternTokens.map((t, i) => (
                          <TokenSpan key={i} token={t} />
                        ))}
                        {flagString && (
                          <span className="text-muted-foreground ml-0.5">
                            /{flagString}
                          </span>
                        )}
                      </code>
                    </div>
                  </Tooltip.Provider>
                )}
              </Card.Content>
            </Card>

            {/* Test string card */}
            <Card>
              <Card.Header className="border-b-2 border-black pb-3">
                <Card.Title>Test String</Card.Title>
              </Card.Header>
              <Card.Content className="pt-4 flex flex-col gap-3">
                <Textarea
                  value={testText}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setTestText(e.target.value)
                  }
                  rows={4}
                  placeholder="Enter text to test your regex against…"
                  className="font-mono text-sm resize-y"
                />

                {pattern && (
                  <div className="whitespace-pre-wrap font-mono text-sm border-2 border-black rounded p-3 bg-background leading-relaxed min-h-14">
                    {highlighted}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Right column: token reference */}
          <div className="sticky top-4">
            <Card>
              <Card.Header className="border-b-2 border-black pb-3">
                <Card.Title>Token Reference</Card.Title>
              </Card.Header>
              <Card.Content className="pt-1 divide-y divide-border">
                {pattern.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-3">
                    Start typing a pattern to see token explanations.
                  </p>
                ) : (
                  tokenTree.map((token, i) => (
                    <TokenRow key={`${token.kind}-${token.raw}-${i}`} token={token} />
                  ))
                )}
              </Card.Content>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
