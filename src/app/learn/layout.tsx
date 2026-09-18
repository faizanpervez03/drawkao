import type { Metadata } from "next";
import LearnPage from "./page";

export const metadata: Metadata = {
  title: "Learn Categories",
  description:
    "Browse fun learning categories for kids: Alphabet, Fruits, Animals, Shapes, Vehicles, and Nature. Start your drawing adventure today!",
  openGraph: {
    title: "Learn Categories | Draw Kao",
    description:
      "Browse fun learning categories for kids: Alphabet, Fruits, Animals, Shapes, Vehicles, and Nature.",
    url: "https://drawkao.vercel.app/learn",
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
