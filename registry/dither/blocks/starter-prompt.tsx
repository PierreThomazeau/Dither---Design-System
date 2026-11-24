import * as React from "react";

import { cn } from "@/registry/dither/lib/utils";

export interface StarterPromptProps extends Omit<React.ComponentProps<"button">, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/** Suggested prompt card for an empty AI chat. */
function StarterPrompt({ icon, title, description, className, ...props }: StarterPromptProps) {
  return (
    <button
      type="button"
      data-slot="starter-prompt"
      className={cn(
        "flex w-full flex-col items-start gap-3 rounded-field border bg-surface p-4 text-left shadow-xs outline-none transition-colors hover:bg-hover focus-visible:shadow-focus",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="flex size-7 items-center justify-center rounded-control border bg-surface text-foreground [&_svg]:size-4">{icon}</span>
      ) : null}
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium">{title}</span>
        {description ? <span className="text-xs leading-4 text-muted-foreground">{description}</span> : null}
      </span>
    </button>
  );
}

export { StarterPrompt };
