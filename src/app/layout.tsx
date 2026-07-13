import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andhika Karunia | Portfolio",
  description: "Andhika Karunia Rizqi - Multi-Disciplinary Professional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-dark text-gray-300 overflow-x-hidden selection:bg-brand-red selection:text-white">
        
        {/* TOP NAVBAR */}
        <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center z-50 absolute top-0 left-0 pointer-events-auto">
          <Link href="/" className="text-xl md:text-2xl font-bold font-sans text-white hover:text-brand-red transition-colors">
            Andhika Karunia
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-medium">
            {["Home", "About", "Portfolio", "Contact"].map((item) => (
              <Link 
                key={item} 
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-gray-400 hover:text-brand-red transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-red transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <div className="relative w-full flex-grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
