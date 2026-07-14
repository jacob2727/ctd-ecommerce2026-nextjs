// @ts-nocheck

"use client";
import { useUser } from "@auth0/nextjs-auth0";
import useUserData from "@/app/hooks/useUserData";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, PackageSearch } from "lucide-react";

const RetailerOrders = () => {
  const [retailerOrders, setRetailerOrders] = useState([]);
  const session = useUser();
  const sessionId = session?.user?.sub;

  // @ts-ignore
  const userData = useUserData(sessionId);
  // @ts-ignore
  const retailerId = userData.id;
  console.log("pid", retailerId);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!retailerId) return;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/get-orders`,
          { retailer_id: retailerId },
        );
        console.log(1);
        setRetailerOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [retailerId]);

  if (session.isLoading) {
  }
<<<<<<< HEAD
  console.log(`Orders: ${JSON.stringify(retailerOrders)}`);
=======
>>>>>>> parent of 28a7517 (Merge branch 'master' of https://github.com/Ismail3427/ctd-ecommerce2026-nextjs)
  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto border-r bg-muted/20 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Retailer Orders
            </h1>

<<<<<<< HEAD
                <p>
                  {console.log(order.finalpriceInCents)}
                  <span className="font-semibold">Price:</span>{" "}
                  {"$" + (parseFloat(order.order.finalPriceInCents) / 100).toFixed(2)}
                </p>
              </div>
            </article>
          ))}
=======
            <p className="mt-1 text-sm text-muted-foreground">
              View the orders customers have placed for your products.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit">
            {retailerOrders.length}{" "}
            {retailerOrders.length === 1 ? "Order" : "Orders"}
          </Badge>
>>>>>>> parent of 28a7517 (Merge branch 'master' of https://github.com/Ismail3427/ctd-ecommerce2026-nextjs)
        </div>

        {retailerOrders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
              <PackageSearch className="mb-4 h-10 w-10 text-muted-foreground" />

              <h2 className="text-lg font-semibold">No orders yet</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Customer orders will appear here once they are placed.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {retailerOrders.map((order: any) => (
              <Card
                key={order.id}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardHeader className="border-b bg-muted/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-lg">
                        Order #{order.id}
                      </CardTitle>

                      <CardDescription className="mt-1 truncate">
                        {order.userName || order.email || "Unknown customer"}
                      </CardDescription>
                    </div>

                    <Badge
                      variant={
                        order.completed || order.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {order.status || "pending"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Customer</span>

                      <span className="text-right font-medium">
                        {order.userName || order.email || "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Product</span>

                      <span className="text-right font-medium">
                        {order.productName || "Unknown product"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground">Completed</span>

                      <Badge
                        variant={order.completed ? "outline" : "secondary"}
                      >
                        {order.completed ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t pt-4">
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Quantity
                      </p>

                      <p className="mt-1 text-xl font-bold">{order.quantity}</p>
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        ${(order.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Order
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

export default RetailerOrders;
