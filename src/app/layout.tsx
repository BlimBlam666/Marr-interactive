import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { isGmModeEnabled } from "@/lib/gm-session";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marr Interactive",
  description: "A visual campaign gazetteer for the fantasy setting of Marr.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gmEnabled = await isGmModeEnabled();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0d0c09] text-stone-100">
        <div className="marr-page-bg min-h-screen">
          <SiteHeader gmEnabled={gmEnabled} />
          {children}
        </div>
      </body>
    </html>
  );
}
