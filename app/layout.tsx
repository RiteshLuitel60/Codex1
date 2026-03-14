import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "World Leaders Atlas",
  description:
    "Verified directory of world leaders with transparent citations, confidence scoring, and historical snapshots.",
  openGraph: {
    title: "World Leaders Atlas",
    description: "A transparent atlas of sovereign national leaders.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main className="mx-auto w-[95%] max-w-7xl py-8 md:py-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
