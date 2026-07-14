import { Metadata } from "next";
import axios from "axios";
import {
  Boxes,
  CheckCircle2,
  Eye,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";

import AddToCartButton from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Product",
  description: "This is our CTD Project Product page",
};

interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  available: boolean;
  showing: boolean;
  location: {
    address?: string;
  } | null;
  discounted: boolean;
}

const ProductIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const { data: product } = await axios.get<Product>(
    `${process.env.NEXT_PUBLIC_API_URL}/product/get/${id}`,
  );

  console.log(product)

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.priceInCents / 100);

  const isInStock = product.stock > 0;
  const canPurchase = product.available && isInStock;

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden">
            <div className="flex min-h-[360px] items-center justify-center bg-gradient-to-br from-muted/40 to-muted">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full border bg-background p-8 shadow-sm">
                  <Package className="h-20 w-20 text-muted-foreground" />
                </div>

                <div>
                  <p className="font-medium">Product preview</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    No product image has been added yet.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={product.available ? "default" : "secondary"}>
                    {product.available ? "Available" : "Unavailable"}
                  </Badge>

                  <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                    {product.stock > 0 ? "In stock" : "Out of stock"}
                  </Badge>

                  {product.discounted && <Badge>Discounted</Badge>}

                  {product.showing && (
                    <Badge variant="secondary">
                      <Eye className="mr-1 h-3 w-3" />
                      Visible
                    </Badge>
                  )}
                </div>

                <div>
                  <CardTitle className="text-3xl leading-tight sm:text-4xl">
                    {product.name}
                  </CardTitle>

                  <p className="mt-4 leading-7 text-muted-foreground">
                    {product.description ||
                      "No description has been provided for this product."}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="border-y py-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Price
                  </p>

                  <p className="mt-1 text-4xl font-bold tracking-tight">
                    {formattedPrice}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Boxes className="h-4 w-4" />
                      Stock
                    </div>

                    <p className="mt-2 text-xl font-semibold">
                      {product.stock} available
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>

                    <p className="mt-2 font-semibold">
                      {product.location?.address || "Location not provided"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <AddToCartButton />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-5 py-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">Product availability</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Current inventory information is shown above.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">Secure checkout</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Add the product to your cart and continue to checkout.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="break-all text-center text-xs text-muted-foreground">
              Product ID: {product.id}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductIdPage;
