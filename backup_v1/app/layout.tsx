import type { Metadata } from "next";
import { Syncopate, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["400", "700"],
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

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syncopate.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-text-body overflow-x-hidden">
        {/* STICKY GLASSMORPHIC NAVBAR */}
        <header className="fixed top-0 left-0 w-full z-[100] glass-panel border-b border-neon-red/20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
            {/* Logo / Name */}
            <a
              href="#hero"
              className="text-heading text-sm md:text-base text-text-primary hover:text-neon-red transition-colors tracking-[0.15em]"
            >
              Andhika Karunia
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-system text-text-muted hover:text-neon-red transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-red transition-all duration-300 group-hover:w-full shadow-[0_0_6px_rgba(255,42,67,0.4)]" />
                </a>
              ))}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex flex-col gap-1.5 group"
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              <span className="w-6 h-[2px] bg-neon-red transition-transform" />
              <span className="w-4 h-[2px] bg-text-muted group-hover:bg-neon-red transition-colors" />
              <span className="w-6 h-[2px] bg-neon-red transition-transform" />
            </button>
          </div>
        </header>

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
                className="text-system text-text-dim hover:text-neon-red transition-colors"
              >
                Github
              </a>
              <a
                href="https://www.linkedin.com/in/andhika-karunia-545166292"
                target="_blank"
                rel="noreferrer"
                className="text-system text-text-dim hover:text-neon-red transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/andhka_rzq"
                target="_blank"
                rel="noreferrer"
                className="text-system text-text-dim hover:text-neon-red transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
