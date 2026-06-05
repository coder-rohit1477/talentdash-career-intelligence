import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalentDash - Salary Insights",
  description: "Explore and compare salaries across top tech companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-white border-t border-[#EBEBEB] pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="max-w-md">
                <Link href="/" className="text-xl font-bold text-[#FF5A5F] tracking-tighter uppercase">
                  TalentDash Career Intelligence Platform
                </Link>
                <p className="mt-4 text-sm text-[#484848] font-medium leading-relaxed">
                  Explore compensation insights, compare companies, and make informed career decisions.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-50 border border-[#EBEBEB] rounded text-[10px] font-bold text-[#717171] uppercase tracking-widest">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div>
                  <h4 className="text-xs font-bold text-[#222222] uppercase tracking-[0.2em] mb-6">Quick Links</h4>
                  <ul className="space-y-4">
                    <li><Link href="/" className="text-sm font-bold text-[#484848] hover:text-[#FF5A5F] transition-colors">Home</Link></li>
                    <li><Link href="/salaries" className="text-sm font-bold text-[#484848] hover:text-[#FF5A5F] transition-colors">Salaries</Link></li>
                    <li><Link href="/compare" className="text-sm font-bold text-[#484848] hover:text-[#FF5A5F] transition-colors">Compare</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-[#EBEBEB] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs font-bold text-[#717171] uppercase tracking-widest">
                © 2026 TalentDash. All rights reserved.
              </div>
              <div className="flex gap-8">
                <span className="text-xs font-bold text-[#717171] hover:text-[#FF5A5F] transition-colors cursor-pointer uppercase tracking-widest">Privacy</span>
                <span className="text-xs font-bold text-[#717171] hover:text-[#FF5A5F] transition-colors cursor-pointer uppercase tracking-widest">Terms</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
