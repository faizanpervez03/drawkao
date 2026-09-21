import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

interface CategoryCardProps {
  name: string;
  description: string;
  emoji: string;
  color: string;
  image?: string;
  href?: string;
}

export function CategoryCard({
  name,
  description,
  emoji,
  color,
  image,
  href = "#",
}: CategoryCardProps) {
  return (
    <Link href={href} className="group relative flex items-center gap-4 w-full text-left bg-background hover:bg-card border-2 border-border hover:border-primary/30 rounded-[1.25rem] p-5 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-secondary/50 p-2"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
        ) : emoji.length <= 2 ? (
          <span className="text-2xl">{emoji}</span>
        ) : (
          <span className="text-lg font-extrabold" style={{ color }}>
            {emoji}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground text-base">{name}</h3>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <div
        className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <ArrowRight className="h-4 w-4" weight="bold" style={{ color }} />
      </div>
    </Link>
  );
}
