"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Percent, Package, DollarSign, Boxes, Tag } from "lucide-react";

interface Discount {
  id: string;
  name: string;
  offer: number;
  product: {
    id: string;
    name: string;
    stock: number;
    priceInCents: number;
  };
}

const ShowAllDiscounts = ({ discounts }: { discounts: Discount[] }) => {
  const router = useRouter();
  if (!discounts.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <Tag className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-xl font-semibold">No Discounts Found</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Create your first discount to start attracting customers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Active Discounts
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage all discounts currently available in your store.
            </p>
          </div>

          <Badge variant="secondary">
            {discounts.length}{" "}
            {discounts.length === 1 ? "Discount" : "Discounts"}
          </Badge>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {discounts.map((item) => {
            const originalPrice = item.product.priceInCents / 100;
            const discountedPrice = originalPrice * (1 - item.offer);

            return (
              <Card
                key={item.id}
                className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{item.name}</CardTitle>

                      <CardDescription>Product Discount</CardDescription>
                    </div>

                    <Badge className="gap-1">
                      <Percent className="h-3 w-3" />
                      {(item.offer * 100).toFixed(0)}%
                    </Badge>
                  </div>

                  <CardAction>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/retailer-dashboard/discounts/${item.id}`)}
                    >
                      View Discount
                    </Button>
                  </CardAction>
                </CardHeader>

                <CardContent className="space-y-5 border-t pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      Product ID
                    </div>

                    <p className="font-medium break-all">{item.product.id}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      Product Name
                    </div>

                    <p className="font-semibold text-lg">{item.product.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-muted/40 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                        <Boxes className="h-4 w-4" />
                        Stock
                      </div>

                      <Badge
                        variant={
                          item.product.stock <= 5 ? "destructive" : "default"
                        }
                      >
                        {item.product.stock} Left
                      </Badge>
                    </div>

                    <div className="rounded-lg border bg-muted/40 p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Savings
                      </div>

                      <p className="font-semibold text-green-600">
                        ${(originalPrice - discountedPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="mb-2 text-sm text-muted-foreground">
                      Pricing
                    </p>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground line-through">
                          ${originalPrice.toFixed(2)}
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                          ${discountedPrice.toFixed(2)}
                        </p>
                      </div>

                      <Badge variant="outline">
                        Save {(item.offer * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default ShowAllDiscounts;
