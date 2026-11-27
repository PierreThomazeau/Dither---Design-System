"use client";

import * as React from "react";
import { Alert02Icon, Cancel01Icon, CloudUploadIcon, File02Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { DitherFill } from "@/registry/dither/lib/dither";
import { DitherDevelop } from "@/registry/dither/lib/dither-develop";
import { Disintegrate } from "@/registry/dither/lib/disintegrate";
import { Icon } from "@/registry/dither/lib/icon";
import { MomentSweep } from "@/registry/dither/lib/moment-sweep";
import { emitMoment } from "@/registry/dither/lib/moments";
import { cn } from "@/registry/dither/lib/utils";
import { Button } from "@/registry/dither/ui/button";
import { Progress } from "@/registry/dither/ui/progress";
import { toast } from "@/registry/dither/ui/toast";

/* ------------------------------------------------------------------ *
 * FileDrop: upload as a dither moment.
 *  - drag a file anywhere on the page: the zone's halo lights up in the
 *    brand colours and breathes; over the zone it tightens
 *  - uploading: progress as dither density (dots light up)
 *  - done: the signature sweep crosses the card, the preview develops,
 *    moment "upload" (companion bravo, sound / haptics if on)
 *  - too big / failed: short error pulse, moment "error", Retry
 *  - remove: the card disintegrates, "Removed · Undo" toast
 * Pass `upload(file, onProgress)` to send for real; without it the
 * upload is simulated (docs, prototypes).
 * ------------------------------------------------------------------ */

export type UploadFn = (file: File, onProgress: (percent: number) => void) => Promise<void>;

type Item = { id: number; file: File; progress: number; status: "uploading" | "done" | "error"; error?: string; url?: string; gone?: boolean; back?: boolean };

export interface FileDropProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  accept?: string;
  multiple?: boolean;
  /** Bytes (default 10 MB). */
  maxSize?: number;
  upload?: UploadFn;
  onFilesChange?: (files: File[]) => void;
  hint?: React.ReactNode;
}

const simulate: UploadFn = (file, onProgress) =>
  new Promise((resolve, reject) => {
    let p = 0;
    const iv = window.setInterval(() => {
      p = Math.min(100, p + 6 + Math.random() * 14);
      onProgress(p);
      if (p >= 100) {
        window.clearInterval(iv);
        if (/fail/i.test(file.name)) reject(new Error("The server refused the file."));
        else resolve();
      }
    }, 160);
  });

const formatSize = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`);

function FileRow({ item, onRemove, onRetry }: { item: Item; onRemove: () => void; onRetry: () => void }) {
  const image = item.file.type.startsWith("image/") && item.url;
  return (
    <div
      className={cn(
        "relative isolate flex items-center gap-3 overflow-hidden rounded-field border bg-surface p-2.5 pr-3 shadow-xs",
        item.status === "error" && "border-destructive/30 motion-safe:animate-[moment-error_360ms_ease-in-out]",
      )}
    >
      {item.status === "done" ? <MomentSweep play={item.id} direction="right" duration={1000} /> : null}
      <DitherDevelop ready={item.status === "done"} className="size-11 shrink-0 rounded-micro border bg-background-muted">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt="" className="size-11 object-cover" />
        ) : (
          <span className="flex size-11 items-center justify-center text-muted-foreground">
            <Icon icon={File02Icon} />
          </span>
        )}
      </DitherDevelop>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium">{item.file.name}</span>
          <span className="shrink-0 font-mono text-xs text-muted-foreground tabular">
            {item.status === "uploading" ? `${Math.round(item.progress)}%` : formatSize(item.file.size)}
          </span>
        </div>
        {item.status === "uploading" ? (
          <Progress variant="density" size="sm" value={item.progress} aria-label={`Uploading ${item.file.name}`} />
        ) : item.status === "error" ? (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <Icon icon={Alert02Icon} size={12} />
            {item.error}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Uploaded</span>
        )}
      </div>
      {item.status === "error" ? (
        <Button variant="ghost" size="icon-sm" aria-label={`Retry ${item.file.name}`} onClick={onRetry}>
          <Icon icon={RefreshIcon} />
        </Button>
      ) : null}
      <Button variant="ghost" size="icon-sm" aria-label={`Remove ${item.file.name}`} onClick={onRemove}>
        <Icon icon={Cancel01Icon} />
      </Button>
    </div>
  );
}

function FileDrop({ accept, multiple = true, maxSize = 10 * 1024 * 1024, upload = simulate, onFilesChange, hint, className, ...props }: FileDropProps) {
  const [items, setItems] = React.useState<Item[]>([]);
  const [dragging, setDragging] = React.useState<"page" | "zone" | null>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const nextId = React.useRef(1);
  const changed = React.useRef(onFilesChange);
  React.useEffect(() => {
    changed.current = onFilesChange;
  });
  React.useEffect(() => {
    changed.current?.(items.filter((i) => i.status === "done" && !i.gone).map((i) => i.file));
  }, [items]);

  const patch = (id: number, p: Partial<Item>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...p } : i)));

  const start = React.useCallback(
    (id: number, file: File) => {
      upload(file, (progress) => patch(id, { progress }))
        .then(() => {
          patch(id, { status: "done", progress: 100 });
          emitMoment("upload", file.name);
        })
        .catch((e: unknown) => {
          patch(id, { status: "error", error: e instanceof Error ? e.message : "Upload failed." });
          emitMoment("error", file.name);
        });
    },
    [upload],
  );

  const add = (files: FileList | File[]) => {
    const list = Array.from(files).slice(0, multiple ? undefined : 1);
    const fresh: Item[] = list.map((file) => {
      const id = nextId.current++;
      const tooBig = file.size > maxSize;
      return {
        id,
        file,
        progress: 0,
        status: tooBig ? "error" : "uploading",
        error: tooBig ? `Too big: ${formatSize(file.size)} (max ${formatSize(maxSize)})` : undefined,
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };
    });
    setItems((cur) => (multiple ? [...cur, ...fresh] : fresh));
    for (const it of fresh) {
      if (it.status === "uploading") start(it.id, it.file);
      else emitMoment("error", it.file.name);
    }
  };

  // A file dragged anywhere on the page wakes the zone up.
  React.useEffect(() => {
    let depth = 0;
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const enter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth++;
      setDragging((d) => d ?? "page");
    };
    const leave = () => {
      depth = Math.max(0, depth - 1);
      if (!depth) setDragging(null);
    };
    const drop = () => {
      depth = 0;
      setDragging(null);
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, []);

  const remove = (item: Item) => {
    patch(item.id, { gone: true });
    toast.undo(`Removed ${item.file.name}`, { onUndo: () => setItems((cur) => (cur.some((i) => i.id === item.id) ? cur.map((i) => (i.id === item.id ? { ...i, gone: false, back: true } : i)) : [...cur, { ...item, gone: false, back: true }])) });
  };

  return (
    <div data-slot="file-drop" className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files: drop them here or press Enter to browse"
        data-dragging={dragging ?? undefined}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            input.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging("zone");
        }}
        onDragLeave={() => setDragging("page")}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(null);
          if (e.dataTransfer.files.length) add(e.dataTransfer.files);
        }}
        className={cn(
          "group/drop relative isolate flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-surface border border-dashed bg-surface px-6 py-10 text-center outline-none transition-[border-color,background-color,scale] duration-(--motion-open-duration) ease-(--motion-open-ease) focus-visible:shadow-focus",
          "hover:border-border-strong data-[dragging=page]:border-brand/40 data-[dragging=zone]:scale-[1.01] data-[dragging=zone]:border-brand data-[dragging=zone]:bg-brand/5",
        )}
      >
        <DitherFill
          key={dragging ? "lit" : "idle"}
          shape="halo"
          fade="edges"
          tint={dragging ? { stops: ["--brand", "--chart-3", "--chart-1"], direction: "to-r" } : undefined}
          className={cn("-z-10 transition-opacity duration-300", dragging ? "opacity-100 motion-safe:animate-[drop-breathe_1.6s_ease-in-out_infinite]" : "opacity-50")}
        />
        <span className="flex size-10 items-center justify-center rounded-full border bg-surface shadow-xs transition-transform duration-(--duration-liquid) ease-(--ease-liquid) group-data-[dragging=zone]/drop:-translate-y-1 group-data-[dragging=zone]/drop:scale-110">
          <Icon icon={CloudUploadIcon} />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{dragging === "zone" ? "Drop to upload" : "Drop files here or browse"}</span>
          <span className="text-xs text-muted-foreground">{hint ?? `Up to ${formatSize(maxSize)} per file`}</span>
        </span>
        <input
          ref={input}
          type="file"
          className="sr-only"
          tabIndex={-1}
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files?.length) add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {items.length ? (
        <div className="flex flex-col gap-2" aria-live="polite">
          {items.map((item) => (
            <Disintegrate key={item.id} gone={item.gone} reassemble={item.back} onGone={() => undefined} className={cn(item.gone && "pointer-events-none")}>
              <FileRow
                item={item}
                onRemove={() => remove(item)}
                onRetry={() => {
                  patch(item.id, { status: "uploading", progress: 0, error: undefined });
                  start(item.id, item.file);
                }}
              />
            </Disintegrate>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { FileDrop };
