import CheckoutButton from "@/components/checkout";
import QuantityChange from "@/components/quantity-change";
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import type { Metadata } from "next";
import { Package, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cart",
  description: "This is the cart page",
};

const CartPage = async () => {
  const session = await auth0.getSession();

  const { data: cart } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/get`,
    {
      userId: session?.user.sub,
    },
  );

  const visibleCartItems = cart.filter((cartItem: any) => cartItem.showing);

  const subtotalInCents = visibleCartItems.reduce(
    (total: number, item: any) =>
      total + item.product.priceInCents * item.quantity,
    0,
  );

  const subtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotalInCents / 100);

  const totalQuantity = visibleCartItems.reduce(
    (total: number, item: any) => total + item.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <ShoppingCart className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your Cart
              </h1>
            </div>

            <p className="mt-3 text-muted-foreground">
              Review your products and quantities before checking out.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit px-3 py-1">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </Badge>
        </div>

        {visibleCartItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-muted p-5">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>

              <h2 className="text-xl font-semibold">Your cart is empty</h2>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Products you add to your cart will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {visibleCartItems.map((item: any) => {
                const itemTotal =
                  (item.product.priceInCents * item.quantity) / 100;

                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border bg-muted/30">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-xl font-semibold">
                              {item.product.name}
                            </h2>

                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                              {item.product.description ||
                                "No description provided."}
                            </p>

                            <p className="mt-3 font-semibold">
                              ${(item.product.priceInCents / 100).toFixed(2)}
                              <span className="ml-1 text-sm font-normal text-muted-foreground">
                                each
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 border-t pt-4 sm:min-w-44 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-sm text-muted-foreground">
                              Quantity
                            </span>

                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                          </div>

                          <QuantityChange
                            cartId={item.id}
                            cart={item}
                            productId={item.product.id}
                          />

                          <div className="flex items-center justify-between gap-5 border-t pt-3">
                            <span className="text-sm text-muted-foreground">
                              Total
                            </span>

                            <span className="font-bold">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <aside>
              <Card className="sticky top-6">
                <CardHeader className="border-b">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Products</span>

                      <span>{visibleCartItems.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Total quantity
                      </span>

                      <span>{totalQuantity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-5">
                    <span className="font-semibold">Subtotal</span>

                    <span className="text-2xl font-bold">{subtotal}</span>
                  </div>

                  <div className="w-full">
                    <CheckoutButton cart={visibleCartItems} />
                  </div>

                  <p className="text-center text-xs leading-5 text-muted-foreground">
                    Final totals may be calculated during checkout.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
