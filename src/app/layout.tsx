import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Thinker UI",
  description: "Interactive React components with tactile materials, motion and copyable source.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
