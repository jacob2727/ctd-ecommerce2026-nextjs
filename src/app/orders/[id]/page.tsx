import axios from "axios";
import type { Metadata } from "next";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Your Order",
  description: "View your order",
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
  timestamp?: string;
  cart: Cart;
}

interface OrderResponse {
  order: Order;
}

const formatCurrency = (priceInCents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
};

const OrdersIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const { data } = await axios.post<OrderResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/delivery/order-id`,
    {
      orderId: id,
    },
  );

  const order = data.order;
  const cart = order.cart;
  const product = cart.product;

  const unitPriceInCents = product.priceInCents;

  const totalInCents =
    order.finalPriceInCents ?? unitPriceInCents * cart.quantity;

  const normalizedStatus = order.status?.toLowerCase() || "pending";

  const isCompleted = order.completed || normalizedStatus === "completed";

  const formattedDate = order.timestamp
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(order.timestamp))
    : null;

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <ReceiptText className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Order Details
                </h1>

                <p className="mt-1 text-muted-foreground">
                  Review your product, total, and order status.
                </p>
              </div>
            </div>
          </div>

          <Badge
            variant={isCompleted ? "default" : "secondary"}
            className="w-fit gap-2 px-3 py-1.5 text-sm capitalize"
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock3 className="h-4 w-4" />
            )}

            {normalizedStatus}
          </Badge>
        </header>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardDescription>Order ID</CardDescription>

                <CardTitle className="mt-1 break-all text-xl">
                  {order.id}
                </CardTitle>
              </div>

              {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {formattedDate}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-7 pt-7">
            <section className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-5 sm:flex-row">
              <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl border bg-background sm:w-24">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Product
                </p>

                <h2 className="mt-1 text-2xl font-semibold">{product.name}</h2>

                {product.description && (
                  <p className="mt-2 leading-7 text-muted-foreground">
                    {product.description}
                  </p>
                )}
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  Quantity
                </div>

                <p className="mt-2 text-2xl font-bold">{cart.quantity}</p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Price each</p>

                <p className="mt-2 text-2xl font-bold">
                  {formatCurrency(unitPriceInCents)}
                </p>
              </div>

              <div className="rounded-xl border bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Order total</p>

                <p className="mt-2 text-2xl font-bold text-primary">
                  {formatCurrency(totalInCents)}
                </p>
              </div>
            </div>

            <Separator />

            <section className="rounded-xl border p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-full p-2 ${
                    isCompleted
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Clock3 className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <h2 className="font-semibold">
                    {isCompleted
                      ? "Order completed"
                      : "Order is being processed"}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {isCompleted
                      ? "This order has been completed successfully."
                      : "Your order has been received and is currently being processed."}
                  </p>
                </div>
              </div>
            </section>

            <p className="break-all text-center text-xs text-muted-foreground">
              Cart ID: {cart.id}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default OrdersIdPage;
