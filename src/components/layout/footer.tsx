"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="bg-[#1b5e20] text-white relative">
      {/* Cream background + wavy top edge — skipped on home (FinalCta provides it) */}
      {!isHome && (
        <div className="bg-[#f5f0e8] dark:bg-[#1a2e1c] pt-16 sm:pt-20 pb-0 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
            <svg viewBox="0 0 1440 70" fill="none" className="w-full h-12 sm:h-16 lg:h-20 block" preserveAspectRatio="none">
              <path d="M0 70 L0 40 Q100 5 200 30 Q300 55 400 35 Q500 15 600 40 Q700 65 800 35 Q900 5 1000 35 Q1100 65 1200 40 Q1300 15 1440 45 L1440 70 Z" fill="#1b5e20" />
            </svg>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={160} height={48} className="h-10 w-auto brightness-0 invert" />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-5 sm:gap-7">
            {[
              { label: "Home", href: "/" },
              { label: "Lessons", href: "/learn" },
              { label: "About", href: "/about" },
              { label: "For Parents", href: "/parent/auth" },
            ].map((link) => (
              <Link key={link.label} href={link.href}
                className="text-[13px] font-medium text-white/85 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social + Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2.5">
              {/* Facebook */}
              <a href="#" className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>
              </a>
            </div>
            <p className="text-[11px] text-white/50">© 2025 Draw Kao. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
