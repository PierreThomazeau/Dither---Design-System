import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "License",
  description: "Free components are MIT licensed. Pro components are licensed per seat for unlimited end products.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground">{children}</div>
    </section>
  );
}

export default function LicensePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">Dither / License</p>
        <h1 className="text-4xl font-semibold tracking-tight">License</h1>
        <p className="text-muted-foreground">A plain-language summary of how you can use Dither. Draft, to be reviewed before the Pro release.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-surface border bg-surface p-5 shadow-xs">
          <span className="font-mono text-xs text-muted-foreground uppercase">Free</span>
          <span className="text-lg font-semibold">MIT</span>
          <span className="text-sm text-muted-foreground">Tokens, dither texture, UI primitives, chart kit.</span>
        </div>
        <div className="flex flex-col gap-1 rounded-surface border bg-surface p-5 shadow-xs">
          <span className="font-mono text-xs text-muted-foreground uppercase">Pro</span>
          <span className="text-lg font-semibold">Commercial, per seat</span>
          <span className="text-sm text-muted-foreground">Blocks, signature charts, showcase screens, Figma library.</span>
        </div>
      </div>

      <Section title="Free components">
        <p>
          Free components are released under the <strong>MIT license</strong>. Use, change and redistribute them, in personal and commercial work, as long as the
          copyright notice stays in the source files. Dither primitives are based on shadcn/ui, also MIT.
        </p>
      </Section>

      <Section title="What a Pro license allows">
        <ul>
          <li>Use Pro components in <strong>unlimited end products</strong>: your own apps, sites and internal tools, and those you build for clients.</li>
          <li>Change the code however you like.</li>
          <li>Ship end products to as many users as you want, free or paid.</li>
          <li>One seat per person who installs or edits Pro components. Team covers up to 10 people.</li>
        </ul>
      </Section>

      <Section title="What it doesn’t allow">
        <ul>
          <li>Reselling or redistributing Dither itself, as a UI kit, template, theme, component library or Figma file, free or paid.</li>
          <li>Building a product whose main value is Dither components (a competing kit or a site builder exposing them).</li>
          <li>Sharing your registry token or license key outside your seats.</li>
        </ul>
      </Section>

      <Section title="Updates and refunds">
        <p>
          Pro yearly and Team include 12 months of updates; you keep what you installed after that. Pro lifetime includes updates for the life of the product. Refunds
          are available within 14 days of purchase.
        </p>
      </Section>

      <p className="text-sm text-muted-foreground">
        Questions? See the <Link href="/pricing#faq" className="underline underline-offset-4">FAQ</Link>.
      </p>
    </main>
  );
}
