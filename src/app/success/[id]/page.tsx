import type { Metadata } from "next";
import Stripe from "stripe";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Mail,
  Package,
  ReceiptText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment was completed successfully.",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const formatCurrency = (
  amountInCents: number | null,
  currency: string | null,
) => {
  if (amountInCents === null) return "Not available";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.toUpperCase() || "USD",
  }).format(amountInCents / 100);
};

const SuccessPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const session = await stripe.checkout.sessions.retrieve(id, {
    expand: ["line_items", "payment_intent"],
  });

  const isPaid = session.payment_status === "paid";

  const customerName =
    session.customer_details?.name ||
    session.customer_details?.email ||
    "Customer";

  const customerEmail = session.customer_details?.email;

  const formattedTotal = formatCurrency(session.amount_total, session.currency);

  const formattedSubtotal = formatCurrency(
    session.amount_subtotal,
    session.currency,
  );

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-11 w-11" />
          </div>

          <Badge className="mt-5 bg-emerald-600 text-white hover:bg-emerald-600">
            Payment complete
          </Badge>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Thanks for your order, {customerName}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Your payment was processed successfully. You can review your
            purchase details below.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Purchased products
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Items included in this payment
                  </CardDescription>
                </div>

                <Badge variant="secondary">
                  {session.line_items?.data.length ?? 0}{" "}
                  {session.line_items?.data.length === 1
                    ? "product"
                    : "products"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="divide-y p-0">
              {session.line_items?.data.map((item) => {
                const itemTotal = formatCurrency(
                  item.amount_total,
                  item.currency,
                );

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-muted/30">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">
                          {item.description || "Product"}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Quantity: {item.quantity ?? 1}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg font-bold">{itemTotal}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ReceiptText className="h-5 w-5" />
                  Payment summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment status</span>

                  <Badge
                    className={
                      isPaid
                        ? "bg-emerald-600 text-white hover:bg-emerald-600"
                        : ""
                    }
                    variant={isPaid ? "default" : "secondary"}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    {session.payment_status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formattedSubtotal}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Currency</span>

                  <span className="uppercase">{session.currency || "USD"}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total paid</span>

                  <span className="text-2xl font-bold">{formattedTotal}</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              <Button asChild>
                <Link href="/orders">
                  View your orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/">Continue shopping</Link>
              </Button>
            </div>
          </aside>
        </div>

        <p className="mt-8 break-all text-center text-xs text-muted-foreground">
          Checkout session: {session.id}
        </p>
      </div>
    </main>
  );
};

export default SuccessPage;
