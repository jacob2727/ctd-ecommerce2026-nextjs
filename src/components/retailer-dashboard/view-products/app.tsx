"use client";

import useUserData from "@/app/hooks/useUserData";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Boxes, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
interface ProductLocation {
  address?: string;
}

interface RetailerProduct {
  id: string;
  name: string;
  description?: string;
  priceInCents: number;
  available: boolean;
  visible: boolean;
  stock: number;
  location?: ProductLocation;
}

const RetailerAllProducts = () => {
  const [retailerProducts, setRetailerProducts] = useState<RetailerProduct[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, isLoading: isUserLoading } = useUser();
  const userId = user?.sub;

  const userData = useUserData(userId);
  //@ts-ignore
  const retailerId = userData?.id;
  const router = useRouter();
  useEffect(() => {
    if (!retailerId) {
      if (!isUserLoading && userId) {
        setIsLoading(false);
      }

      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.post<RetailerProduct[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/get-products`,
          {
            retailer_id: retailerId,
          },
          {
            signal: controller.signal,
          },
        );

        setRetailerProducts(response.data);
      } catch (error) {
        if (axios.isCancel(error)) return;

        console.error("Unable to fetch retailer products:", error);
        setError("We could not load your products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [retailerId, isUserLoading, userId]);

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(priceInCents / 100);
  };

  if (isUserLoading || isLoading) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-md bg-muted" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </CardHeader>

                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="h-5 animate-pulse rounded bg-muted"
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              All Products
            </h1>

            <p className="mt-2 text-muted-foreground">
              View and manage all the products connected to your store.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit px-3 py-1 text-sm">
            {retailerProducts.length}{" "}
            {retailerProducts.length === 1 ? "product" : "products"}
          </Badge>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {!error && retailerProducts.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>

              <h2 className="text-xl font-semibold">No products found</h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Products that you create for this retailer will appear here.
              </p>
            </CardContent>
          </Card>
        )}

        {!error && retailerProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {retailerProducts.map((product) => (
              <Card
                onClick={() => router.push(`/retailer-dashboard/${product.id}`)}
                key={product.id}
                className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="border-b bg-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-xl">
                        {product.name}
                      </CardTitle>

                      <CardDescription className="mt-1 truncate">
                        ID: {product.id}
                      </CardDescription>
                    </div>

                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3">
                    <Badge
                      variant={product.available ? "default" : "secondary"}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </Badge>

                    <Badge
                      variant={product.showing ? "outline" : "destructive"}
                    >
                      {product.showing ? "Visible" : "Hidden"}
                    </Badge>

                    {product.stock <= 5 && (
                      <Badge variant="destructive">Low stock</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-6">
                  {product.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Price
                      </div>

                      <p className="text-lg font-semibold">
                        {formatPrice(product.priceInCents)}
                      </p>
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Boxes className="h-4 w-4" />
                        Stock
                      </div>

                      <p className="text-lg font-semibold">{product.stock}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t pt-4">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Produced at
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {product.location?.address || "No location provided"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default RetailerAllProducts;
