import type { Metadata } from "next";
import Link from "next/link";
import { Analytics02Icon, Invoice01Icon, KanbanIcon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { LogoMark } from "@/components/site/logo";
import { OnboardingChecklist } from "@/registry/dither/blocks/onboarding-checklist";
import { DitherFill } from "@/registry/dither/lib/dither";
import { Icon } from "@/registry/dither/lib/icon";
import { Button } from "@/registry/dither/ui/button";
import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/dither/ui/radio-group";

export const metadata: Metadata = { title: "Onboarding · Showcase" };

const steps = ["Workspace", "Use case", "Invite team", "Connect data"];

const templates = [
  { icon: Analytics02Icon, label: "Dashboards" },
  { icon: Invoice01Icon, label: "Invoices" },
  { icon: KanbanIcon, label: "Boards" },
  { icon: UserGroupIcon, label: "Teams" },
];

/** Full-page onboarding wizard (no sidebar), step 2 of 4. */
export default function Onboarding() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-background text-foreground">
      <DitherFill shape="scatter" fade="bottom" className="inset-auto top-0 left-0 -z-10 h-80 w-full" />
      <header className="flex h-16 items-center gap-3 px-6">
        <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-primary-foreground">
          <LogoMark className="size-3.5" />
        </span>
        <span className="text-sm font-semibold">Northwind Studio</span>
        <span className="ml-auto text-sm text-muted-foreground">Step 2 of 4</span>
        <Button asChild variant="ghost" size="sm">
          <Link href="/showcase">Skip setup</Link>
        </Button>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_300px]">
          <section className="flex flex-col gap-1 rounded-sheet bg-background-muted p-1">
            <ol className="flex flex-wrap gap-x-4 gap-y-1 px-4 pt-3 pb-2 text-xs">
              {steps.map((s, i) => (
                <li key={s} className={i === 1 ? "font-medium text-foreground" : "text-muted-foreground"} aria-current={i === 1 ? "step" : undefined}>
                  <span className="mr-1.5 font-mono tabular">{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-6 rounded-[calc(var(--radius-sheet)-4px)] border bg-surface p-6 shadow-xs md:p-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">What will you use Dither for?</h1>
                <p className="text-sm text-muted-foreground">We’ll set up templates and a starter dashboard. You can change this later.</p>
              </div>
              <RadioGroup defaultValue="delivery" aria-label="Use case" className="grid gap-2 sm:grid-cols-2">
                <RadioGroupItem variant="box" placement="end" value="delivery" label="Product delivery" description="Sprints, boards and team health." />
                <RadioGroupItem variant="box" placement="end" value="finance" label="Finance" description="Invoices, budgets and cash flow." />
                <RadioGroupItem variant="box" placement="end" value="analytics" label="Revenue analytics" description="ARR, retention and funnels." />
                <RadioGroupItem variant="box" placement="end" value="people" label="People ops" description="Hiring, onboarding and reviews." />
              </RadioGroup>
              <div className="grid gap-2">
                <Label htmlFor="ob-size">Team size</Label>
                <Input id="ob-size" type="number" defaultValue={24} className="max-w-32 font-mono" />
              </div>
              <div className="flex items-center justify-between gap-3 border-t pt-5">
                <Button variant="ghost">Back</Button>
                <Button>Continue</Button>
              </div>
            </div>
          </section>
          <aside className="flex flex-col gap-4">
            <OnboardingChecklist
              title="Your setup"
              steps={[
                { label: "Create the workspace", done: true },
                { label: "Choose a use case" },
                { label: "Invite your team" },
                { label: "Connect a data source" },
              ]}
            />
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {templates.map((t) => (
                <span key={t.label} className="flex items-center gap-2 rounded-field border bg-surface p-3">
                  <Icon icon={t.icon} />
                  {t.label}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
