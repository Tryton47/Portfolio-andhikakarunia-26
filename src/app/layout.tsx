import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import LenisProvider from "@/providers/LenisProvider";
import Navbar from "@/components/Navbar";
import { CursorTrail, CustomCursor, FloatingParticles, ScrollIndicator } from "@/components/InteractiveEffects";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Andhika Karunia Rizqi | Portfolio",
  description:
    "Multi-Disciplinary Professional — Web Developer, Data Analyst, Graphic Designer & Videographer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased overflow-x-hidden w-full`}
      >
        <body suppressHydrationWarning className="min-h-full flex flex-col bg-charcoal text-text-muted overflow-x-hidden w-full">
        <ThemeProvider>
          <LenisProvider>
          {/* INTERACTIVE EFFECTS */}
          <CursorTrail />
          <CustomCursor />
          <FloatingParticles count={30} />
          <ScrollIndicator />

          {/* GSAP SMART NAVBAR */}
          <Navbar />

          {/* MAIN CONTENT */}
          <main className="relative w-full flex-grow">{children}</main>

          {/* FOOTER */}
          <footer className="w-full border-t border-border py-8 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-system text-text-dim">
                © 2026 Andhika Karunia Rizqi
              </p>
              <div className="flex gap-6">
                <a
                  href="https://github.com/Tryton47"
                  target="_blank"
                  rel="noreferrer"
                  className="text-system text-text-dim hover:text-primary transition-colors"
                >
                  Github
                </a>
                <a
                  href="https://www.linkedin.com/in/andhikakarunia/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-system text-text-dim hover:text-primary transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/andhika.kr_/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-system text-text-dim hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </footer>
        </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
