import type { Metadata } from "next";

import { AppShell } from "@/components/showcase/app-shell";
import { northwind } from "@/components/showcase/nav";
import { PageHeader } from "@/components/showcase/page-header";
import { ApiKeys, BrandAssets, SaveButton } from "@/components/showcase/settings-moments";
import { UsageMeter } from "@/registry/dither/blocks/usage-meter";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";
import { Button } from "@/registry/dither/ui/button";
import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/dither/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/dither/ui/select";
import { Switch } from "@/registry/dither/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/registry/dither/ui/tabs";
import { Textarea } from "@/registry/dither/ui/textarea";

export const metadata: Metadata = { title: "Settings · Showcase" };

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 py-6 first:pt-0 md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex max-w-xl flex-col gap-4">{children}</div>
    </div>
  );
}

export default function Settings() {
  return (
    <AppShell {...northwind("Settings")} breadcrumb={["Settings", "Workspace"]}>
      <div className="flex flex-col gap-6 p-5 md:p-6">
        <PageHeader
          title="Settings"
          actions={
            <>
              <Button variant="ghost">Discard</Button>
              <SaveButton />
            </>
          }
        />
        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          <Tabs defaultValue="workspace" orientation="vertical" className="hidden lg:flex">
            <TabsList variant="line" className="w-full">
              {["Profile", "Workspace", "Members", "Notifications", "Billing", "API keys", "Security"].map((t) => (
                <TabsTrigger key={t} value={t.toLowerCase()}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex min-w-0 flex-col divide-y">
            <Row title="Brand assets" description="Logos and files your team and clients see.">
              <BrandAssets />
            </Row>
            <Row title="API keys" description="Keys for integrations. Revoking takes effect at once; you can undo for a few seconds.">
              <ApiKeys />
            </Row>
            <Row title="Workspace" description="Name, address and look of Northwind Studio.">
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarFallback className="bg-foreground text-primary-foreground">NS</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Upload logo</Button>
                <Button variant="ghost" size="sm">Remove</Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-name">Workspace name</Label>
                <Input id="ws-name" defaultValue="Northwind Studio" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-url">Workspace URL</Label>
                <Input id="ws-url" defaultValue="northwind" className="font-mono" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-about">About</Label>
                <Textarea id="ws-about" defaultValue="Product studio building tools for finance teams." />
              </div>
            </Row>
            <Row title="Preferences" description="Defaults for every member.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full" aria-label="Language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Week starts on</Label>
                  <Select defaultValue="mon">
                    <SelectTrigger className="w-full" aria-label="Week starts on">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mon">Monday</SelectItem>
                      <SelectItem value="sun">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <RadioGroup defaultValue="system" aria-label="Theme" className="grid gap-2 sm:grid-cols-3">
                <RadioGroupItem variant="box" value="light" label="Light" />
                <RadioGroupItem variant="box" value="dark" label="Dark" />
                <RadioGroupItem variant="box" value="system" label="System" />
              </RadioGroup>
            </Row>
            <Row title="Notifications" description="What we email you about.">
              <Switch variant="box" placement="end" label="Weekly digest" description="A summary of delivery and revenue every Monday." defaultChecked />
              <Switch variant="box" placement="end" label="Mentions" description="When someone mentions you in a task or comment." defaultChecked />
              <Switch variant="box" placement="end" label="Product updates" description="New features and improvements, once a month." />
            </Row>
            <Row title="Plan & usage" description="Pro plan · renews on Dec 1.">
              <UsageMeter label="Seats" max={25} segments={[{ label: "Members", value: 21 }, { label: "Invited", value: 2 }]} caption="2 seats left" />
              <UsageMeter label="API calls" max={10000} segments={[{ label: "Production", value: 7600 }, { label: "Staging", value: 1100 }]} status="warning" caption="87% used · resets Dec 1" />
              <div>
                <Button variant="outline" size="sm">Manage plan</Button>
              </div>
            </Row>
            <Row title="Danger zone" description="Irreversible actions.">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-field border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Delete workspace</span>
                  <span className="text-sm text-muted-foreground">All projects, reports and members are removed.</span>
                </div>
                <Button variant="destructive" size="sm">Delete workspace</Button>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
