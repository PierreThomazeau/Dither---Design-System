import { Button } from "@/registry/dither/ui/button";
import { Checkbox } from "@/registry/dither/ui/checkbox";
import { Switch } from "@/registry/dither/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export default function MotionLiquid() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-6">
        <Switch label="Live" defaultChecked />
        <Checkbox label="Notify me" />
      </div>
      <Button size="lg">Hover and press me</Button>
    </div>
  );
}
