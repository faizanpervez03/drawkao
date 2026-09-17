import { BookOpen, Star, Flame } from "@phosphor-icons/react";

const stats = [
  {
    icon: BookOpen,
    value: "6",
    label: "Lessons completed",
    color: "#2e7d32",
  },
  {
    icon: Star,
    value: "12",
    label: "Stars earned",
    color: "#f5a623",
  },
  {
    icon: Flame,
    value: "3",
    label: "Day streak",
    color: "#e57373",
  },
];

export function ProgressPreview() {
  return (
    <section id="progress" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-card border-2 border-border rounded-[2rem] p-8 sm:p-12 max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Keep Drawing!
            </h2>
            <p className="text-muted-foreground text-lg">
              Your child is making great progress. Every drawing builds skills
              and confidence.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="space-y-3">
                  <div
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon className="h-6 w-6" weight="duotone" style={{ color: stat.color }} />
                  </div>
                  <p className="text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-4 py-2 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Progress tracking coming soon
          </div>
        </div>
      </div>
    </section>
  );
}
