"use client";

import * as React from "react";
import {
  Attachment01Icon,
  AiBrain01Icon,
  ArrowDown01Icon,
  ArrowUp02Icon,
  GridViewIcon,
  Message01Icon,
  Mic01Icon,
  Search02Icon,
  SparklesIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";

import { AiGlow } from "@/registry/dither/lib/ai-glow";
import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/registry/dither/ui/dropdown-menu";

export interface ComposerTool {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const DEFAULT_TOOLS: ComposerTool[] = [
  { id: "think", label: "Think deeper", icon: <Icon icon={AiBrain01Icon} /> },
  { id: "research", label: "Deep research", icon: <Icon icon={Search02Icon} /> },
  { id: "more", label: "More", icon: <Icon icon={GridViewIcon} /> },
];

export interface ChatComposerProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  placeholder?: string;
  /** Current mode label (footer, left). */
  mode?: string;
  modes?: string[];
  onModeChange?: (mode: string) => void;
  /** Current model label (footer, right). */
  model?: string;
  models?: string[];
  onModelChange?: (model: string) => void;
  showTools?: boolean;
  showFooter?: boolean;
  tools?: ComposerTool[];
  /** Called with the trimmed message on Enter or send. */
  onSubmit?: (message: string, activeTools: string[]) => void;
  /** Shows a stop button instead of send. */
  busy?: boolean;
  onStop?: () => void;
  /** Called on every keystroke (e.g. to put a Companion in "listening"). */
  onValueChange?: (value: string) => void;
}

const pill =
  "inline-flex h-7 items-center gap-1.5 rounded-full border bg-surface px-2.5 text-xs font-medium text-foreground outline-none transition-colors hover:bg-hover focus-visible:shadow-focus aria-pressed:border-brand/40 aria-pressed:bg-brand/10 aria-pressed:text-brand [&_svg]:size-3.5";

const iconBtn =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-hover hover:text-foreground focus-visible:shadow-focus";

/* Pickers sit on the AI dither: a solid surface pill keeps them readable. */
const picker =
  "inline-flex h-7 items-center gap-1.5 rounded-control border bg-surface px-2.5 text-xs font-medium text-foreground outline-none hover:bg-hover focus-visible:shadow-focus data-[state=open]:bg-hover [&_svg]:size-3.5";

/**
 * Two-tone AI composer: a raised surface (text, attach, tools, voice, send) inside a muted shell
 * that carries the mode and model pickers over the AI glow.
 */
function ChatComposer({
  placeholder = "Ask anything, @mention a file or type / for commands",
  mode = "Direct chat",
  modes = ["Direct chat", "Agent"],
  onModeChange,
  model = "Atlas 2",
  models = ["Atlas 2", "Atlas 2 Fast", "Atlas Mini"],
  onModelChange,
  showTools = true,
  showFooter = true,
  tools = DEFAULT_TOOLS,
  onSubmit,
  busy = false,
  onStop,
  onValueChange,
  className,
  ...props
}: ChatComposerProps) {
  const [value, setValue] = React.useState("");
  const [active, setActive] = React.useState<string[]>([]);
  const [currentMode, setCurrentMode] = React.useState(mode);
  const [currentModel, setCurrentModel] = React.useState(model);
  const canSend = value.trim().length > 0 && !busy;

  const submit = () => {
    if (!canSend) return;
    onSubmit?.(value.trim(), active);
    setValue("");
    onValueChange?.("");
  };

  return (
    <form
      data-slot="chat-composer"
      className={cn("flex w-full flex-col rounded-surface bg-background-muted p-1", showFooter && "pb-0", className)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      {...props}
    >
      <div className="flex flex-col gap-2 rounded-[calc(var(--radius-surface)-4px)] border bg-surface p-3 shadow-xs focus-within:border-ring">
        <textarea
          aria-label="Message"
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          className="field-sizing-content max-h-48 min-h-11 w-full resize-none bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label="Attach a file" className={iconBtn}>
            <Icon icon={Attachment01Icon} />
          </button>
          {showTools ? (
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {tools.map((tool) => {
                const on = active.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive((a) => (on ? a.filter((t) => t !== tool.id) : [...a, tool.id]))}
                    className={pill}
                  >
                    {tool.icon}
                    {tool.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-1">
            <button type="button" aria-label="Voice input" className={iconBtn}>
              <Icon icon={Mic01Icon} />
            </button>
            {busy ? (
              <button
                type="button"
                aria-label="Stop generating"
                onClick={onStop}
                className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-button-primary outline-none focus-visible:shadow-[var(--dither-shadow-button-primary),var(--dither-shadow-focus)]"
              >
                <Icon icon={StopIcon} size={14} />
              </button>
            ) : (
              <button
                type="submit"
                aria-label="Send message"
                disabled={!canSend}
                className="inline-flex size-8 items-center justify-center rounded-full bg-primary bg-linear-to-b from-white/8 to-white/0 text-primary-foreground shadow-button-primary outline-none transition-opacity hover:from-white/14 focus-visible:shadow-[var(--dither-shadow-button-primary),var(--dither-shadow-focus)] disabled:opacity-40"
              >
                <Icon icon={ArrowUp02Icon} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
      {showFooter ? (
        <div className="relative isolate flex h-control items-center justify-between gap-2 overflow-hidden rounded-b-[calc(var(--radius-surface)-4px)] px-1.5">
          <AiGlow className="left-1/3" />
          <DropdownMenu>
            <DropdownMenuTrigger className={picker} aria-label={`Mode: ${currentMode}`}>
              <Icon icon={Message01Icon} />
              {currentMode}
              <Icon icon={ArrowDown01Icon} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Mode</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={currentMode}
                onValueChange={(m) => {
                  setCurrentMode(m);
                  onModeChange?.(m);
                }}
              >
                {modes.map((m) => (
                  <DropdownMenuRadioItem key={m} value={m}>
                    {m}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className={picker} aria-label={`Model: ${currentModel}`}>
              <span className="text-muted-foreground">Model</span>
              <Icon icon={SparklesIcon} />
              {currentModel}
              <Icon icon={ArrowDown01Icon} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Model</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={currentModel}
                onValueChange={(m) => {
                  setCurrentModel(m);
                  onModelChange?.(m);
                }}
              >
                {models.map((m) => (
                  <DropdownMenuRadioItem key={m} value={m}>
                    {m}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </form>
  );
}

export { ChatComposer };
