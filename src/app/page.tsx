"use client";

import { Hero } from "@/components/home/hero";
import { CategorySection } from "@/components/home/category-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturedLessons } from "@/components/home/featured-lessons";
import { ProgressPreview } from "@/components/home/progress-preview";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <HowItWorks />
      <FeaturedLessons />
      <ProgressPreview />
      <FinalCta />
    </>
  );
}
