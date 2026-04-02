import type { Metadata } from "next";
import { Cormorant_Garamond, Sora } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Babel Restaurant Ghana | Accra's Elevated Mediterranean Experience",
  description:
    "Babel Restaurant Ghana blends modern Lebanese and seafood dining with signature hospitality in Accra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-onyx text-cream">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
