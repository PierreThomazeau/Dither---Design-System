import { Button } from "@/registry/dither/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/dither/ui/drawer";

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Monthly target</DrawerTitle>
            <DrawerDescription>Set the revenue target for November.</DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center justify-center gap-4 p-6">
            <span className="font-heading text-5xl font-semibold tracking-tight tabular">€120k</span>
          </div>
          <DrawerFooter>
            <Button>Save target</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
