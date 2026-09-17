import { Eye, Headphones, Pencil, PaintBrush, Lightbulb } from "@phosphor-icons/react";

const steps = [
  {
    number: "01",
    title: "See",
    description: "Discover something new.",
    icon: Eye,
    color: "#2e7d32",
  },
  {
    number: "02",
    title: "Listen",
    description: "Hear the word and learn how it sounds.",
    icon: Headphones,
    color: "#f5a623",
  },
  {
    number: "03",
    title: "Draw",
    description: "Follow simple drawing steps.",
    icon: Pencil,
    color: "#5c9ce6",
  },
  {
    number: "04",
    title: "Color",
    description: "Make your drawing your own.",
    icon: PaintBrush,
    color: "#e57373",
  },
  {
    number: "05",
    title: "Learn",
    description: "Remember what you created.",
    icon: Lightbulb,
    color: "#9575cd",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left text */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider">
              Simple steps, big progress
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              How Draw Kao Works
            </h2>
            <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
              Kids draw, explore and learn — all in one safe, interactive,
              guided place.
            </p>
          </div>

          {/* Right steps */}
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group flex items-start gap-5 bg-card border-2 border-border hover:border-primary/30 rounded-[1.25rem] p-5 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                >
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <Icon className="h-6 w-6" weight="duotone" style={{ color: step.color }} />
                  </div>
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        {step.number}
                      </span>
                      <h3 className="font-bold text-foreground text-lg">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
