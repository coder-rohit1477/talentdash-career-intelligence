'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Salaries', href: '/salaries' },
    { name: 'Compare', href: '/compare' },
  ];

  return (
    <nav className="bg-white border-b border-[#EBEBEB] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-4 md:space-x-8 flex-shrink-0">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl md:text-2xl text-[#FF5A5F] tracking-tighter">
              TalentDash
            </Link>
            <div className="flex space-x-4 md:space-x-8 h-16">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors h-full ${
                      isActive
                        ? 'border-[#FF5A5F] text-[#FF5A5F]'
                        : 'border-transparent text-[#484848] hover:text-[#222222] hover:border-[#EBEBEB]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
