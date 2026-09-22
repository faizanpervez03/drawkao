import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      {/* CTA Area with green hills background */}
      <div className="relative bg-[#f5f0e8] pt-16 sm:pt-24 pb-0">
        {/* Decorative elements */}
        <div className="absolute top-8 left-[8%] text-primary/60 text-2xl">✨</div>
        <div className="absolute top-16 right-[12%] text-accent text-xl">💛</div>

        {/* Left side text */}
        <div className="absolute top-10 sm:top-14 left-[4%] sm:left-[8%] max-w-[180px] hidden sm:block">
          <p className="text-primary font-bold text-lg leading-snug" style={{ fontFamily: "cursive" }}>
            A brighter
            <br />
            future through
            <br />
            creativity 💚
          </p>
        </div>

        {/* Center content */}
        <div className="relative text-center px-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 leading-tight">
            Let&apos;s Make Learning
            <br />
            More Colorful!
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md mx-auto">
            Join thousands of parents who trust Draw Kao to make learning fun, simple and meaningful.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center bg-primary text-white hover:bg-primary/90 text-base font-bold px-8 py-3.5 rounded-full shadow-[0_4px_16px_rgba(46,125,50,0.3)] hover:shadow-[0_6px_24px_rgba(46,125,50,0.4)] transition-all gap-2"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" weight="bold" />
          </Link>
        </div>

        {/* Right side pencil illustration */}
        <div className="absolute top-6 sm:top-10 right-[4%] sm:right-[8%] hidden sm:block">
          <div className="relative w-24 h-32">
            {/* Pencil body */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-24 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-sm transform rotate-12">
              <div className="absolute top-0 left-0 right-0 h-4 bg-red-400 rounded-t-sm" />
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-amber-200 to-amber-300" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[12px] border-t-amber-800" />
            </div>
            {/* Swirl */}
            <svg className="absolute -bottom-4 -left-8 w-20 h-16" viewBox="0 0 80 60" fill="none">
              <path d="M10 50 Q20 10 40 30 Q60 50 50 20 Q45 5 55 15" stroke="#f5a623" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Green hills at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120 L0 60 Q180 0 360 40 Q540 80 720 30 Q900 -20 1080 50 Q1260 100 1440 60 L1440 120 Z" fill="#2e7d32" />
            <path d="M0 120 L0 80 Q200 40 400 70 Q600 100 800 60 Q1000 20 1200 70 Q1350 100 1440 80 L1440 120 Z" fill="#1b5e20" />
          </svg>
        </div>
      </div>

      {/* Dark green footer */}
      <footer className="bg-[#1b5e20] text-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={160} height={48} className="h-10 w-auto brightness-0 invert" />
            </div>

            {/* Nav Links */}
            <nav className="flex items-center gap-6 sm:gap-8">
              {[
                { label: "Home", href: "/" },
                { label: "Lessons", href: "/learn" },
                { label: "About", href: "/about" },
                { label: "For Parents", href: "/parent/auth" },
              ].map((link) => (
                <Link key={link.label} href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social + Copyright */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>
                </a>
              </div>
              <p className="text-xs text-white/50">© 2025 Draw Kao. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
