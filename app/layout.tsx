import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";

import { appDescription, appName, siteUrl } from "@/lib/shared";
import { MomentPrefsInit } from "@/registry/dither/lib/moment-settings";
import { Toaster } from "@/registry/dither/ui/toast";
import "./global.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${appName} — Design system`, template: `%s · ${appName}` },
  description: appDescription,
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          {children}
          <Toaster />
          <MomentPrefsInit />
        </RootProvider>
      </body>
    </html>
  );
}
