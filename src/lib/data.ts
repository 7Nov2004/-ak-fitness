export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  flavors: string[];
  sizes: string[];
  inStock: boolean;
  description: string;
  nutritionFacts: string[];
};

export const categories = [
  "Whey Protein",
  "Creatine",
  "Mass Gainer",
  "Pre Workout",
  "Fat Burner",
  "Vitamins",
  "Accessories"
];

export const products: Product[] = [
  {
    id: "p1",
    name: "A.K FITNESS Platinum Whey Isolate",
    category: "Whey Protein",
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.8,
    reviews: 1245,
    image: "/images/whey_protein_mockup_1779896568815.png",
    flavors: ["Double Rich Chocolate", "Vanilla Ice Cream", "Strawberry Banana"],
    sizes: ["2 lbs", "5 lbs"],
    inStock: true,
    description: "Premium whey protein isolate for rapid muscle recovery and growth. 25g of pure protein per scoop.",
    nutritionFacts: ["Protein: 25g", "Carbs: 1g", "Fat: 0.5g", "Calories: 110"]
  },
  {
    id: "p2",
    name: "A.K FITNESS Micronized Creatine",
    category: "Creatine",
    price: 29.99,
    rating: 4.9,
    reviews: 890,
    image: "/images/creatine_mockup_1779896591656.png",
    flavors: ["Unflavored", "Fruit Punch"],
    sizes: ["300g", "600g"],
    inStock: true,
    description: "Pure micronized creatine monohydrate to increase strength, power, and muscle mass.",
    nutritionFacts: ["Creatine Monohydrate: 5g"]
  },
  {
    id: "p3",
    name: "A.K FITNESS N.O. Xplode Pre-Workout",
    category: "Pre Workout",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.7,
    reviews: 650,
    image: "/images/pre_workout_mockup_1779896606138.png",
    flavors: ["Green Apple", "Blue Raspberry", "Watermelon"],
    sizes: ["30 Servings"],
    inStock: true,
    description: "Explosive energy, enhanced endurance, and maximum performance. Get the most out of every workout.",
    nutritionFacts: ["Caffeine: 300mg", "Beta-Alanine: 3.2g", "L-Citrulline: 6g"]
  }
];
