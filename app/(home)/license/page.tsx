import type { Metadata } from "next";

import { gitConfig } from "@/lib/shared";

export const metadata: Metadata = {
  title: "License",
  description: "Dither is free and released under the MIT license.",
};

export default function LicensePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Dither / License</p>
        <h1 className="text-4xl font-semibold tracking-tight">License</h1>
        <p className="text-muted-foreground">Dither is free and open source, released under the MIT license.</p>
      </header>

      <section className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">In short</h2>
        <ul>
          <li>Use Dither in <strong>personal and commercial</strong> projects, for you or your clients.</li>
          <li>Change, copy and redistribute the code.</li>
          <li>Keep the copyright and license notice in the source files.</li>
          <li>The software is provided as is, without warranty.</li>
        </ul>
        <p>Dither primitives are based on shadcn/ui, also MIT licensed.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">MIT License</h2>
        <pre className="overflow-x-auto rounded-surface border bg-surface p-5 font-mono text-xs leading-5 whitespace-pre-wrap text-muted-foreground shadow-xs">
{`Copyright (c) 2026 Pierre Thomazeau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        </pre>
        <p className="text-sm text-muted-foreground">
          The same text is in the <a className="underline underline-offset-4" href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/main/LICENSE`}>LICENSE</a> file of the repository.
        </p>
      </section>
    </main>
  );
}
