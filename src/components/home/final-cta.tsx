import Link from "next/link";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";

export function FinalCta() {
  return (
    <section className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-primary/10 rounded-[2.5rem] px-6 sm:px-12 py-14 sm:py-16 text-center space-y-6 overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-6 left-[15%] h-3 w-3 rounded-full bg-accent/40" />
          <div className="absolute top-10 right-[20%] h-2 w-2 rounded-full bg-primary/30" />
          <div className="absolute bottom-8 left-[25%] h-2.5 w-2.5 rounded-full bg-destructive/30" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 bg-card/60 dark:bg-card/80 text-primary text-sm font-semibold px-4 py-2 rounded-full">
              <Sparkle className="h-4 w-4" weight="fill" />
              A brighter future through creativity
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Ready to Draw Something?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">
              Pick a lesson, grab your pencil, and start learning.
            </p>
            <div className="pt-3">
              <Link
                href="/learn"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold px-10 py-3.5 rounded-full shadow-[0_4px_16px_rgba(46,125,50,0.3)] hover:shadow-[0_6px_24px_rgba(46,125,50,0.4)] transition-all gap-2"
              >
                Start Drawing
                <ArrowRight className="h-4 w-4" weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
