"use client";

import * as React from "react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { Slot } from "radix-ui";

import { Icon } from "@/registry/dither/lib/icon";
import { emitMoment } from "@/registry/dither/lib/moments";
import { cn } from "@/registry/dither/lib/utils";
import { Label } from "@/registry/dither/ui/label";

/* ------------------------------------------------------------------ *
 * Field: label, control, description and error wired together (ids,
 * aria-describedby, aria-invalid). The error appears next to the field
 * with a short shake (moment-error), never in a toast.
 * ------------------------------------------------------------------ */

type FieldContextValue = { id: string; descriptionId: string; errorId: string; invalid: boolean; hasDescription: boolean; hasError: boolean };
const FieldContext = React.createContext<FieldContextValue | null>(null);

function useField() {
  const ctx = React.useContext(FieldContext);
  if (!ctx) throw new Error("Field parts must be used inside <Field>.");
  return ctx;
}

export interface FieldProps extends React.ComponentProps<"div"> {
  /** Error message (makes the field invalid). */
  error?: React.ReactNode;
  invalid?: boolean;
  description?: React.ReactNode;
  /** Also emit the "error" moment when the error appears (companion, haptics). Default false. */
  moment?: boolean;
}

function Field({ error, invalid, description, moment = false, className, children, ...props }: FieldProps) {
  const base = React.useId().replace(/[^a-zA-Z0-9-]/g, "");
  const isInvalid = invalid ?? Boolean(error);
  const value = React.useMemo(
    () => ({ id: `field-${base}`, descriptionId: `field-${base}-description`, errorId: `field-${base}-error`, invalid: isInvalid, hasDescription: Boolean(description), hasError: Boolean(error) }),
    [base, isInvalid, description, error],
  );
  const errorKey = typeof error === "string" ? error : error ? "error" : "";
  React.useEffect(() => {
    if (moment && errorKey) emitMoment("error");
  }, [moment, errorKey]);
  return (
    <FieldContext.Provider value={value}>
      <div data-slot="field" data-invalid={isInvalid || undefined} className={cn("grid gap-2", className)} {...props}>
        {children}
        {description ? (
          <p id={value.descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        {error ? (
          <p key={errorKey} id={value.errorId} role="alert" className="flex items-center gap-1.5 text-sm text-destructive-ink motion-safe:animate-[moment-error_360ms_ease-in-out]">
            <Icon icon={Alert02Icon} size={14} />
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { id } = useField();
  return <Label htmlFor={id} className={className} {...props} />;
}

/** Wraps the control (Input, Textarea, Select trigger…) and gives it the id and aria attributes. */
function FieldControl(props: React.ComponentProps<typeof Slot.Root>) {
  const { id, descriptionId, errorId, invalid, hasDescription, hasError } = useField();
  const describedBy = [hasDescription ? descriptionId : null, hasError ? errorId : null].filter(Boolean).join(" ") || undefined;
  return <Slot.Root id={id} aria-invalid={invalid || undefined} aria-describedby={describedBy} {...props} />;
}

export { Field, FieldControl, FieldLabel, useField };
