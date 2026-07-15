"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Store } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/all`,
      );
      console.log("Products response:", productsRes.data);
      setProducts(productsRes.data);
    };

    fetchProducts();
  }, []);

  console.log(products);

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Product Catalog
            </h1>

            <p className="mt-2 text-muted-foreground">
              Browse products from all retailers.
            </p>
          </div>

          <Badge variant="secondary">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </Badge>
        </div>

        {products.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <Package className="mb-4 h-10 w-10 text-muted-foreground" />

              <h2 className="text-xl font-semibold">No Products Found</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Products will appear here when retailers publish them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any) => (
              <Card
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="line-clamp-2">
                      {product.name}
                    </CardTitle>

                    <Package className="h-5 w-5 text-primary" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      variant={product.available ? "secondary" : "destructive"}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </Badge>

                    {product.discounted && (
                      <Badge variant="secondary">Discounted</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <Store className="h-4 w-4" />
                      Retailer
                    </div>

                    <p className="font-semibold">{product.owner.name}</p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Price
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      ${(product.priceInCents / 100).toFixed(2)}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/product/${product.id}`);
                    }}
                  >
                    View Product
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductCatalog;
