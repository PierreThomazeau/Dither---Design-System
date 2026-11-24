import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export default function TabsSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Tabs key={size} defaultValue="week">
          <TabsList size={size}>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  );
}
