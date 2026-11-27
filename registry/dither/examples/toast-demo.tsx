"use client";

import { toast } from "@/registry/dither/ui/toast";
import { Button } from "@/registry/dither/ui/button";

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Report scheduled", { description: "Every Monday at 9:00." })}>Default</Button>
      <Button variant="outline" onClick={() => toast.success("Invoice sent", { description: "Northwind Studio · €4,820" })}>Success</Button>
      <Button variant="outline" onClick={() => toast.error("Payment failed", { description: "The card was declined." })}>Error</Button>
      <Button variant="outline" onClick={() => toast.undo("Project archived", { onUndo: () => toast("Project restored") })}>Undo</Button>
    </div>
  );
}
