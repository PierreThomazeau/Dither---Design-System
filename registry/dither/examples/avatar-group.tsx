import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/registry/dither/ui/avatar";

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      {["AL", "JB", "MK", "SR"].map((initials) => (
        <Avatar key={initials} size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount size="sm">+8</AvatarGroupCount>
    </AvatarGroup>
  );
}
