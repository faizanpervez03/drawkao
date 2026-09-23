import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export function FinalCta() {
  return (
    <section className="relative">
      {/* CTA Area with cream background */}
      <div className="relative bg-[#f5f0e8] pt-14 sm:pt-20 pb-36 sm:pb-48 overflow-hidden">
        {/* Left side text - handwriting style */}
        <div className="absolute top-8 sm:top-12 left-[3%] sm:left-[6%] max-w-[160px] hidden sm:block z-10">
          <p className="text-primary font-bold text-base sm:text-lg leading-snug" style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive" }}>
            A brighter
            <br />
            future through
            <br />
            creativity 💚
          </p>
          {/* Small sparkles */}
          <div className="absolute -top-3 -left-2 text-yellow-400 text-xs">✨</div>
          <div className="absolute top-16 -right-1 text-yellow-400 text-xs">💛</div>
        </div>

        {/* Center content */}
        <div className="relative text-center px-4 max-w-xl mx-auto z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#1b5e20] mb-4 leading-tight">
            Let&apos;s Make Learning
            <br />
            More Colorful!
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-7 max-w-sm mx-auto leading-relaxed">
            Join thousands of parents who trust Draw Kao to make learning fun, simple and meaningful.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center bg-[#1b5e20] text-white hover:bg-[#2e7d32] text-sm sm:text-base font-bold px-7 py-3 rounded-full shadow-[0_4px_16px_rgba(27,94,32,0.3)] hover:shadow-[0_6px_24px_rgba(27,94,32,0.4)] transition-all gap-2"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" weight="bold" />
          </Link>
        </div>

        {/* Right side pencil illustration */}
        <div className="absolute top-2 sm:top-4 right-[0%] sm:right-[3%] z-10 pointer-events-none">
          <Image
            src="/images/pencil_footer.png"
            alt=""
            width={240}
            height={300}
            className="w-40 sm:w-52 lg:w-64 h-auto"
            priority={false}
          />
        </div>

        {/* Green hills at bottom - small, left side */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 z-0 pointer-events-none">
          <Image
            src="/images/leaf_footer.png"
            alt=""
            width={400}
            height={200}
            className="w-64 sm:w-80 lg:w-96 h-auto block"
            priority={false}
          />
        </div>

        {/* Wavy transition to footer */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 70" fill="none" className="w-full h-12 sm:h-16 lg:h-20 block" preserveAspectRatio="none">
            <path d="M0 70 L0 40 Q100 5 200 30 Q300 55 400 35 Q500 15 600 40 Q700 65 800 35 Q900 5 1000 35 Q1100 65 1200 40 Q1300 15 1440 45 L1440 70 Z" fill="#1b5e20" />
          </svg>
        </div>
      </div>
    </section>
  );
}
