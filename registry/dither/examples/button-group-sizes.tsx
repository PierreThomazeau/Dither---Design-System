import { Button } from "@/registry/dither/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/registry/dither/ui/button-group";

export default function ButtonGroupSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <ButtonGroup key={size} size={size} aria-label={`${size} group`}>
          <Button variant="ghost" size="sm">Day</Button>
          <ButtonGroupSeparator />
          <Button variant="ghost" size="sm">Week</Button>
          <ButtonGroupSeparator />
          <Button variant="ghost" size="sm">Month</Button>
        </ButtonGroup>
      ))}
    </div>
  );
}
