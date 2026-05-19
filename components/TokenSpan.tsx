"use client";

import { cn } from "@/lib/utils";
import { Tooltip } from "./retroui/Tooltip";
import { RegexToken, TOKEN_CLS } from "@/lib/regexTokenizer";

export function TokenSpan({ token }: { token: RegexToken }) {
  const hoverCls = "transition-transform hover:scale-125 hover:z-10 relative";

  if (token.kind === "charClass") {
    const bracketCls = cn(TOKEN_CLS.charClass, "rounded-sm px-0.5 cursor-default select-none inline-block", hoverCls);
    return (
      <span className="inline-flex items-center mr-0.5">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <span className={bracketCls}>[</span>
          </Tooltip.Trigger>
          <Tooltip.Content side="top">{token.description}</Tooltip.Content>
        </Tooltip>
        {token.children?.map((child, i) => <TokenSpan key={i} token={child} />)}
        <Tooltip>
          <Tooltip.Trigger asChild>
            <span className={bracketCls}>]</span>
          </Tooltip.Trigger>
          <Tooltip.Content side="top">{token.description}</Tooltip.Content>
        </Tooltip>
      </span>
    );
  }

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <span className={cn("inline rounded-sm px-0.5 mr-0.5 cursor-default select-none", TOKEN_CLS[token.kind] ?? "", hoverCls)}>
          {token.raw}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">{token.description}</Tooltip.Content>
    </Tooltip>
  );
}
