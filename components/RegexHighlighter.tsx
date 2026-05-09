"use client";

import { useMemo, useEffect, ReactNode } from "react";
import { compilePattern, getMatches, Match } from "@/lib/regexUtils";
import { cn } from "@/lib/utils";
import { Card } from "./retroui/Card";
import { Badge } from "./retroui/Badge";

interface Props {
  pattern: string;
  flags?: string;
  text: string;
  className?: string;
  matchClassName?: string;
  onError?: (err: Error) => void;
  isCorrect?: boolean;
}

function tokenizePattern(pattern: string) {
  // Simple heuristics to split pattern into token-like pieces for basic highlighting
  const tokenRe =
    /(\\.|\[.*?\]|\(\?:|\(|\)|\{\d+(?:,\d*)?\}|\*\?|\*|\+\?|\+|\?|\^|\$|\||\.|\+)/g;
  const parts: Array<string> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(pattern)) !== null) {
    if (m.index > last) parts.push(pattern.slice(last, m.index));
    parts.push(m[0]);
    last = m.index + m[0].length;
  }
  if (last < pattern.length) parts.push(pattern.slice(last));
  return parts;
}

export const RegexHighlighter = ({
  pattern,
  flags = "",
  text,
  className = "",
  matchClassName = "bg-yellow-200 rounded-sm m-0",
  onError,
  isCorrect,
}: Props) => {
  const compiled = useMemo(
    () => compilePattern(pattern, flags),
    [pattern, flags],
  );

  useEffect(() => {
    if (compiled.error && onError) onError(compiled.error);
  }, [compiled, onError]);

  const matches = useMemo(() => {
    if (pattern.length === 0) return [] as Match[];
    if (compiled.regex) return getMatches(text, compiled.regex);
    return [] as Match[];
  }, [pattern.length, compiled.regex, text]);

  // render pattern with basic token highlights
  const patternTokens = useMemo(() => tokenizePattern(pattern), [pattern]);

  // render text with highlighted matches
  const highlighted = useMemo(() => {
    if (!matches.length) return [text];
    const out: Array<ReactNode> = [];
    let cursor = 0;
    matches.forEach((m, i) => {
      if (m.start > cursor) {
        out.push(
          <span key={`text-${i}`} className="relative z-10">
            {text.slice(cursor, m.start)}
          </span>,
        );
      }
      out.push(
        <span
          key={`match-${i}`}
          className={cn(
            matchClassName,
            "mx-1 ring-1 ring-yellow-200 relative z-0",
          )}
        >
          {text.slice(m.start, m.end)}
        </span>,
      );
      cursor = m.end;
    });
    if (cursor < text.length) {
      out.push(
        <span key="text-end" className="relative z-10">
          {text.slice(cursor)}
        </span>,
      );
    }
    return out;
  }, [text, matches, matchClassName]);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 text-sm flex items-center justify-between">
        <div>
          <span className="font-medium mr-2">Pattern:</span>
          <code className="p-1 rounded bg-surface text-sm">
            {patternTokens.map((t, i) => {
              const cls = t.startsWith("\\")
                ? "bg-purple-600"
                : t.startsWith("[")
                  ? "bg-emerald-600"
                  : /[+*?{}]/.test(t)
                    ? "bg-rose-600"
                    : "text-foreground";
              return (
                <span key={i} className={cls + " p-1 rounded-sm mr-1"}>
                  {t}
                </span>
              );
            })}
            <span className="text-muted-foreground">/{flags}</span>
          </code>
        </div>
        {isCorrect ? (
          <Badge variant="surface" size="sm" className="bg-green-500">
            Correct
          </Badge>
        ) : (
          <Badge variant="surface" size="sm" className="bg-red-500">
            Incorrect
          </Badge>
        )}
      </div>

      {compiled.error ? (
        <div role="alert" className="text-destructive">
          {String(compiled.error.message || compiled.error)}
        </div>
      ) : null}
      <Card className="w-full whitespace-pre-wrap wrap-break-word rounded border-2 p-3 bg-background text-md">
        {highlighted}
      </Card>
    </div>
  );
};

export default RegexHighlighter;
