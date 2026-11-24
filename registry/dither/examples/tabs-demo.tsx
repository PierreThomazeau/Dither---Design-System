import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="rounded-surface border bg-surface p-4 shadow-xs">
        <p className="font-medium">Overview</p>
        <p className="text-muted-foreground">You have <span className="font-mono tabular">12</span> active projects and <span className="font-mono tabular">3</span> pending tasks.</p>
      </TabsContent>
      <TabsContent value="reports" className="rounded-surface border bg-surface p-4 shadow-xs">4 reports scheduled.</TabsContent>
    </Tabs>
  );
}
