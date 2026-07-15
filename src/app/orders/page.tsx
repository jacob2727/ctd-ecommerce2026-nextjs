import { auth0 } from "@/lib/auth0";
import axios from "axios";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Package,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Orders",
  description: "View and manage your orders",
};

interface Product {
  id: string;
  name: string;
  description?: string;
  priceInCents: number;
}

interface Cart {
  id: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  status: string;
  completed: boolean;
  finalPriceInCents?: number;
  timestamp: string;
  cart: Cart;
}

const formatPrice = (priceInCents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
};

const formatDate = (timestamp: string) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

const OrdersPage = async () => {
  const session = await auth0.getSession();
  const userId = session?.user?.sub;

  if (!userId) {
    return (
      <main className="flex min-h-[500px] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <h1 className="text-2xl font-bold">Sign in required</h1>

            <p className="mt-2 text-muted-foreground">
              You need to sign in before viewing your orders.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/get`,
    {
      userId,
    },
  );

  const orders: Order[] = Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data?.orders)
      ? response.data.orders
      : [];
  console.log(orders);
  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <ReceiptText className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your Orders
              </h1>
            </div>

            <p className="mt-3 text-muted-foreground">
              Review your purchases and track their current status.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit px-3 py-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </Badge>
        </header>

        {orders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="mb-5 rounded-full bg-muted p-5">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>

              <h2 className="text-xl font-semibold">No orders found</h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Orders placed using this account will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const product = order.cart?.product;
              const quantity = order.cart?.quantity ?? 0;

              const totalInCents =
                order.finalPriceInCents ??
                (product?.priceInCents ?? 0) * quantity;

              const isCompleted =
                order.completed || order.status?.toLowerCase() === "completed";

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="group block"
                >
                  <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                    <CardHeader className="border-b bg-muted/20">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Order ID
                          </p>

                          <CardTitle className="mt-1 break-all text-lg">
                            {order.id}
                          </CardTitle>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge
                            variant={isCompleted ? "default" : "secondary"}
                            className="gap-1.5 capitalize"
                          >
                            <Clock3 className="h-3.5 w-3.5" />
                            {order.status || "Pending"}
                          </Badge>

                          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5">
                      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border bg-muted/30">
                            <Package className="h-9 w-9 text-muted-foreground" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">
                              Product
                            </p>

                            <h2 className="mt-1 truncate text-xl font-semibold">
                              {product?.name || "Unknown product"}
                            </h2>

                            {product?.description && (
                              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                {product.description}
                              </p>
                            )}

                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                Quantity
                              </span>

                              <Badge variant="outline">{quantity}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:min-w-[300px]">
                          <div className="rounded-xl border bg-muted/20 p-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarDays className="h-3.5 w-3.5" />
                              Ordered
                            </div>

                            <p className="mt-2 text-sm font-medium">
                              {order.timestamp
                                ? formatDate(order.timestamp)
                                : "Unknown date"}
                            </p>
                          </div>

                          <div className="rounded-xl border bg-muted/20 p-4">
                            <p className="text-xs text-muted-foreground">
                              Total
                            </p>

                            <p className="mt-2 text-xl font-bold">
                              {formatPrice(totalInCents)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
