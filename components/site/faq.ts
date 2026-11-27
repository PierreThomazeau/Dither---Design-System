/** Site FAQ (landing page). Backticks render as inline code. */
export const faqs: { q: string; a: string }[] = [
  {
    q: "Is Dither free?",
    a: "Yes, free of charge. It is not open source though: the docs, components and registry open with an access code, and Dither itself can't be redistributed.",
  },
  {
    q: "Is Dither a package I install from npm?",
    a: "No. Like shadcn/ui, components are copied into your project with `npx shadcn add @dither/<name>`. The code is yours to read and change.",
  },
  {
    q: "What do I need to use it?",
    a: "React 19, Tailwind CSS v4 and a `components.json` (run `npx shadcn init`). Next.js is the reference setup, but any React framework with Tailwind v4 works.",
  },
  {
    q: "Can I use it in client projects?",
    a: "Yes, in personal and commercial projects, for you or your clients. Don't redistribute Dither itself or share your access code, and keep the notice in the files you copy.",
  },
  {
    q: "How do I get access?",
    a: "Enter your access code on the site to open the docs, showcase and registry. For the shadcn CLI and the MCP server, send the same code as `Authorization: Bearer <code>`.",
  },
  {
    q: "Does it work in dark mode?",
    a: "Every component and screen is built for light and dark from the start, with `.dark` on `<html>`.",
  },
  {
    q: "Can my AI assistant use it?",
    a: "Yes. Connect the Dither MCP server or point it to `/llms.txt`: it can list components, read their source and install them.",
  },
];
