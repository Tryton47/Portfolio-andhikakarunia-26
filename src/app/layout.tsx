import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-charcoal text-text-muted overflow-x-hidden">
        <ThemeProvider>
          {/* STICKY GLASSMORPHIC NAVBAR */}
          <header className="fixed top-0 left-0 w-full z-[100] backdrop-blur-xl bg-obsidian/60 border-b border-border/80 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
              {/* Logo / Name */}
              <a
                href="#hero"
                className="text-heading text-sm md:text-base text-text-primary hover:text-primary transition-colors tracking-[0.1em]"
              >
                Andhika Karunia Rizqi
              </a>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-system text-text-muted hover:text-primary transition-colors relative group"
                  >
                    {item.label}
                    {/* Underline uses inline style so it reacts to theme var */}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full"
                      style={{ background: 'var(--theme-primary-hex)' }}
                    />
                  </a>
                ))}
              </nav>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden flex flex-col gap-1.5 group"
                aria-label="Menu"
                id="mobile-menu-toggle"
              >
                <span className="w-6 h-[1.5px] bg-text-primary transition-all group-hover:bg-primary" />
                <span className="w-4 h-[1.5px] bg-text-muted group-hover:bg-primary transition-colors" />
                <span className="w-6 h-[1.5px] bg-text-primary transition-all group-hover:bg-primary" />
              </button>
            </div>
          </header>

          {/* FLOATING THEME SWITCHER */}
          <ThemeSwitcher />

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
        </ThemeProvider>
      </body>
    </html>
  );
}
