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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Draw Kao",
            url: "https://drawkao.vercel.app",
            description:
              "Help your child learn letters, words, fruits, animals, shapes and more through fun drawing activities. Designed for ages 4-8.",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            audience: {
              "@type": "PeopleAudience",
              suggestedMinAge: 4,
              suggestedMaxAge: 8,
            },
            featureList: [
              "Learn alphabet letters",
              "Learn fruits and vegetables",
              "Learn animals",
              "Learn shapes and colors",
              "Learn numbers",
              "Interactive drawing activities",
              "Parent dashboard",
              "Progress tracking",
            ],
          }),
        }}
      />
      <Hero />
      <CategorySection />
      <HowItWorks />
      <FeaturedLessons />
      <ProgressPreview />
      <FinalCta />
    </>
  );
}
