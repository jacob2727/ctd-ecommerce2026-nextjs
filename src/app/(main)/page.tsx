import ProductCatalog from "@/components/home/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Commerce 2026",
  description: "This is our CTD Project",
};

const HomePage = () => {
  return (
    <main>
      <ProductCatalog />
    </main>
  );
};

export default HomePage;
