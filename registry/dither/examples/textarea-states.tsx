import { Textarea } from "@/registry/dither/ui/textarea";

export default function TextareaStates() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Textarea aria-invalid defaultValue="Too short" />
      <Textarea disabled placeholder="Disabled" />
    </div>
  );
}
