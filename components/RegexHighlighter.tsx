"use client";

import { useMemo, useEffect, ReactNode } from "react";
import { compilePattern, getMatches, Match } from "@/lib/regexUtils";
import { cn } from "@/lib/utils";
import { Card } from "./retroui/Card";
import { Badge } from "./retroui/Badge";
import { Tooltip } from "./retroui/Tooltip";
import { TokenSpan } from "./TokenSpan";
import { tokenize } from "@/lib/regexTokenizer";

interface Props {
  pattern: string;
  flags?: string;
  text: string;
  className?: string;
  matchClassName?: string;
  onError?: (err: Error) => void;
  isCorrect?: boolean;
}

export const RegexHighlighter = ({
  pattern,
  flags = "",
  text,
  className = "",
  matchClassName = "bg-primary/50 rounded-sm m-0",
  onError,
  isCorrect,
}: Props) => {
  const compiled = useMemo(() => compilePattern(pattern, flags), [pattern, flags]);

  useEffect(() => {
    if (compiled.error && onError) onError(compiled.error);
  }, [compiled, onError]);

  const matches = useMemo(() => {
    if (pattern.length === 0) return [] as Match[];
    if (compiled.regex) return getMatches(text, compiled.regex);
    return [] as Match[];
  }, [pattern.length, compiled.regex, text]);

  const patternTokens = useMemo(() => tokenize(pattern), [pattern]);

  const highlighted = useMemo(() => {
    if (!matches.length) return [text];
    const out: Array<ReactNode> = [];
    let cursor = 0;
    matches.forEach((m, i) => {
      if (m.start > cursor)
        out.push(<span key={`text-${i}`}>{text.slice(cursor, m.start)}</span>);
      out.push(
        <span key={`match-${i}`} className={cn(matchClassName, "mx-1 ring-1 ring-primary")}>
          {text.slice(m.start, m.end)}
        </span>,
      );
      cursor = m.end;
    });
    if (cursor < text.length)
      out.push(<span key="text-end">{text.slice(cursor)}</span>);
    return out;
  }, [text, matches, matchClassName]);

  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={0} disableHoverableContent>
      <div className={cn("w-full", className)}>
        <div className="mb-2 text-sm flex items-center justify-between">
          <div className="flex items-center flex-wrap gap-1">
            <span className="font-medium">Pattern:</span>
            <code className="px-1 py-0.5 rounded bg-muted text-foreground text-sm inline-flex items-center flex-wrap gap-y-0.5">
              {patternTokens.map((t, i) => <TokenSpan key={i} token={t} />)}
              {flags && <span className="text-muted-foreground ml-0.5">/{flags}</span>}
            </code>
          </div>
          {isCorrect ? (
            <Badge variant="surface" size="sm" className="bg-green-500">Correct</Badge>
          ) : (
            <Badge variant="surface" size="sm" className="bg-red-500">Incorrect</Badge>
          )}
        </div>

        {compiled.error && (
          <div role="alert" className="text-destructive text-sm mb-2">
            {String(compiled.error.message || compiled.error)}
          </div>
        )}

        <Card className="w-full whitespace-pre-wrap wrap-break-word rounded border-2 p-3 bg-background text-md">
          {highlighted}
        </Card>
      </div>
    </Tooltip.Provider>
  );
};

export default RegexHighlighter;
