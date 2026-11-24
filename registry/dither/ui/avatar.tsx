"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/registry/dither/lib/utils";

const avatarVariants = cva("group/avatar relative flex shrink-0 overflow-hidden rounded-full bg-background-muted select-none", {
  variants: {
    size: {
      xs: "size-6 text-[10px] [&_svg]:size-3",
      sm: "size-8 text-xs [&_svg]:size-4",
      default: "size-10 text-sm [&_svg]:size-4",
      lg: "size-12 text-base [&_svg]:size-5",
      xl: "size-16 text-lg [&_svg]:size-6",
    },
  },
  defaultVariants: { size: "default" },
});

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root data-slot="avatar" data-size={size ?? "default"} className={cn(avatarVariants({ size }), className)} {...props} />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full object-cover", className)} {...props} />;
}

/** Initials or an icon. */
function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center font-medium text-muted-foreground uppercase", className)}
      {...props}
    />
  );
}

/** Overlapping avatars separated by a surface ring. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-surface", className)}
      {...props}
    />
  );
}

/** "+N" counter at the end of a group, sized like its siblings. */
function AvatarGroupCount({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof avatarVariants>) {
  return (
    <div
      data-slot="avatar"
      className={cn(avatarVariants({ size }), "items-center justify-center font-mono font-medium tabular text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
