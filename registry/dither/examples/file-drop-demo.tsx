import { FileDrop } from "@/registry/dither/blocks/file-drop";

export default function FileDropDemo() {
  return <FileDrop className="max-w-md" hint="Images or PDF, up to 10 MB. Name a file “fail” to see an error." />;
}
