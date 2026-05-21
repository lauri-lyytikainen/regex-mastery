"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/retroui/Input";
import { ToggleGroup, ToggleGroupItem } from "@/components/retroui/ToggleGroup";
import { Tooltip } from "@/components/retroui/Tooltip";
import RegexHighlighter from "@/components/RegexHighlighter";
import { FLAG_LIST, FLAG_DESCRIPTIONS, type Flag } from "@/lib/flags";

interface Props {
  initialPattern?: string;
  initialFlags?: Flag[];
  text?: string;
  onChange?: (pattern: string, flags: Flag[]) => void;
  isCorrect?: boolean;
}

export const RegexEditor = ({
  initialPattern = "",
  initialFlags = ["g"],
  text = "",
  onChange,
  isCorrect,
}: Props) => {
  const [pattern, setPattern] = useState(initialPattern);
  const [flags, setFlags] = useState<Flag[]>(initialFlags);
  const [error, setError] = useState<string | null>(null);

  const flagString = flags.join("");

  function isFlag(value: string): value is Flag {
    return (FLAG_LIST as readonly string[]).includes(value);
  }

  function normalizeFlags(values: string[]) {
    return values.filter(isFlag);
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-4">
        <Input
          value={pattern}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const newPattern = e.target.value;
            setError(null);
            setPattern(newPattern);
            onChange?.(newPattern, flags);
          }}
          placeholder="Enter your regex here..."
          aria-invalid={!!error}
        />

        <div className="flex gap-2 flex-wrap">
          <Tooltip.Provider>
            <ToggleGroup
              type="multiple"
              value={flags}
              onValueChange={(vals) => {
                const newFlags = normalizeFlags(vals);
                setError(null);
                setFlags(newFlags);
                onChange?.(pattern, newFlags);
              }}
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
                    {FLAG_DESCRIPTIONS[f] ?? `Flag ${f}`}
                  </Tooltip.Content>
                </Tooltip>
              ))}
            </ToggleGroup>
          </Tooltip.Provider>
        </div>

        <div>
          <RegexHighlighter
            pattern={pattern}
            flags={flagString}
            text={text}
            onError={(err) => setError(String(err?.message || err))}
            isCorrect={isCorrect}
          />
        </div>
      </div>
    </div>
  );
};

export default RegexEditor;
