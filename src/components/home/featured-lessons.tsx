"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "@phosphor-icons/react";

const lessons = [
  {
    letter: "A",
    word: "Apple",
    image: "/images/apple.webp",
    color: "#e57373",
    categoryId: "alphabet",
    slug: "a",
  },
  {
    letter: "B",
    word: "Ball",
    image: "/images/featured_ball.jpg",
    color: "#5c9ce6",
    categoryId: "alphabet",
    slug: "b",
  },
  {
    letter: "C",
    word: "Cat",
    image: "/images/cat.jpg",
    color: "#f5a623",
    categoryId: "alphabet",
    slug: "c",
  },
  {
    letter: "D",
    word: "Dog",
    image: "/images/featured_dog.jpg",
    color: "#2e7d32",
    categoryId: "alphabet",
    slug: "d",
  },
];

export function FeaturedLessons() {
  return (
    <section id="lessons" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Start With Something Simple
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            Pick a letter, learn the word, draw it, and color it.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {lessons.map((lesson) => (
            <Link
              key={lesson.letter}
              href={`/learn/${lesson.categoryId}/${lesson.slug}/draw`}
              className="group relative bg-background hover:bg-background border-2 border-border hover:border-primary/30 rounded-[1.25rem] p-6 text-center transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Star className="h-4 w-4 text-accent" weight="fill" />
              </div>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl mb-3 overflow-hidden transition-transform group-hover:scale-110">
                <Image
                  src={lesson.image}
                  alt={lesson.word}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-bold text-foreground text-lg">
                {lesson.letter} — {lesson.word}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Learn → Draw → Color
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Start Lesson
                <ArrowRight className="h-3.5 w-3.5" weight="bold" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center border-2 border-border text-muted-foreground hover:bg-secondary hover:border-border rounded-full px-8 py-2.5 font-semibold transition-all"
          >
            View All Lessons
          </Link>
        </div>
      </div>
    </section>
  );
}
