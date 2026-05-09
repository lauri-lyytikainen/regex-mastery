export type GroupMatch = {
  name?: string | null;
  text: string | null;
  start: number;
  end: number;
};

export type Match = {
  start: number;
  end: number;
  text: string;
  groups: GroupMatch[];
};

export type CompiledRegex =
  | { regex: RegExp; error?: undefined }
  | { error: Error; regex?: undefined };

export function compilePattern(pattern: string, flags = ""): CompiledRegex {
  try {
    const r = new RegExp(pattern, flags);
    return { regex: r };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error };
  }
}

export function getMatches(text: string, regex: RegExp): Match[] {
  // Inject the 'd' flag to get the exact start and end indices of capture groups
  const flags = regex.flags.includes("d") ? regex.flags : regex.flags + "d";
  const r = new RegExp(regex.source, flags);
  const out: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = r.exec(text)) !== null) {
    const full = m[0];
    const start = m.index;
    const end = start + full.length;

    // Extracted indices provided by the 'd' flag
    const matchWithIndices = m as RegExpExecArray & {
      indices?: [number, number][];
    };
    const indices = matchWithIndices.indices;

    const groups = (m.slice(1) as Array<string | undefined>).map((g, idx) => {
      if (g == null)
        return { name: null, text: null, start: -1, end: -1 } as GroupMatch;

      // Use the indices array (idx + 1 because idx 0 in indices is the full match)
      const groupBounds = indices ? indices[idx + 1] : null;
      const gstart = groupBounds ? groupBounds[0] : -1;
      const gend = groupBounds ? groupBounds[1] : -1;

      return {
        name: null,
        text: g,
        start: gstart,
        end: gend,
      } as GroupMatch;
    });
    out.push({ start, end, text: full, groups });

    // Stop after the first match if the global flag is not set
    if (!regex.flags.includes("g")) break;

    // Prevent infinite loop on zero-length matches
    if (r.lastIndex === m.index) r.lastIndex++;
  }
  return out;
}
