import { products } from "@/lib/data";
import ClientPage from "./client";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function Page() {
  return <ClientPage />;
}
