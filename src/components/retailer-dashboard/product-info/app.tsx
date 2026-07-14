"use client";

interface Product {
  available: boolean;
  description: string;
  id: string;
  location: Location;
  name: string;
  priceInCents: Number;
  showing: boolean;
  stock: Number;
}

export default function ProductProfile(product: Product) {
  return <div>{JSON.stringify(product)}</div>;
}
