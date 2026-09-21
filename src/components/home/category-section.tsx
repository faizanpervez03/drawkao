import { CategoryCard } from "./category-card";

const categories = [
  {
    name: "Alphabets",
    description: "Learn A–Z with fun drawings",
    emoji: "ABC",
    color: "#2e7d32",
    image: "/images/abc.avif",
    href: "/learn/alphabet",
  },
  {
    name: "Fruits",
    description: "Draw & discover yummy fruits",
    emoji: "🍎",
    color: "#e57373",
    image: "/images/apple.webp",
    href: "/learn/fruits",
  },
  {
    name: "Animals",
    description: "Sketch cute furry friends",
    emoji: "🐱",
    color: "#5c9ce6",
    image: "/images/cat.jpg",
    href: "/learn/animals",
  },
  {
    name: "Shapes",
    description: "Draw, recognize & learn",
    emoji: "⬡",
    color: "#f5a623",
    image: "/images/shapes.jpg",
    href: "/learn/shapes",
  },
  {
    name: "Vehicles",
    description: "Cars, trains & planes",
    emoji: "🚗",
    color: "#9575cd",
    image: "/images/car.jpg",
    href: "/learn/vehicles",
  },
  {
    name: "Nature",
    description: "Trees, flowers & sunshine",
    emoji: "🌸",
    color: "#4caf50",
    image: "/images/nature.jpg",
    href: "/learn/nature",
  },
];

export function CategorySection() {
  return (
    <section id="categories" className="bg-card pt-2 pb-20 sm:pt-4 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider">
            What will you learn today?
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Explore Our Learning Categories
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            From A to Z, fruits to animals — discover a world of learning
            through fun drawing activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
