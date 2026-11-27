import { Textarea } from "@/registry/dither/ui/textarea";

export default function TextareaStates() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Textarea aria-invalid aria-label="Release notes" defaultValue="Too short" />
      <Textarea disabled aria-label="Disabled field" placeholder="Disabled" />
    </div>
  );
}
