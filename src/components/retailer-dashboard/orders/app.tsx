"use client";

import { useUser } from "@auth0/nextjs-auth0";
import useUserData from "@/app/hooks/useUserData";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";

type RetailerOrder = {
  id: string;
  completed: boolean;
  status?: string;
  order?: {
    finalPriceInCents?: number;
    cart?: {
      quantity?: number;
      user?: {
        name?: string;
        email?: string;
      };
      product?: {
        name?: string;
      };
    };
  };
};

const RetailerOrders = () => {
  const [retailerOrders, setRetailerOrders] = useState<RetailerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const session = useUser();
  const sessionId = session.user?.sub;

  const userData = useUserData(sessionId);
  // @ts-ignore
  const retailerId = userData.id;
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!retailerId) {
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError("");

        const response = await axios.post<RetailerOrder[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/get-orders`,
          {
            retailer_id: retailerId,
          },
        );
        
        setRetailerOrders(response.data);

      } catch (error) {
        console.error("Failed to fetch orders:", error);

        if (axios.isAxiosError(error)) {
          console.error("Status:", error.response?.status);
          console.error("Backend response:", error.response?.data);
        }

        setOrdersError("Unable to load retailer orders.");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [retailerId]);

  if (session.isLoading) {
  }

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto border-r bg-muted/20 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Retailer Orders
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View the orders customers have placed for your products.
            </p>
          </div>

          <Badge variant="secondary" className="w-fit">
            {retailerOrders.length}{" "}
            {retailerOrders.length === 1 ? "Order" : "Orders"}
          </Badge>
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
            {retailerOrders.map((order) => {
              const cart = order.order?.cart;
              const customer = cart?.user;
              const product = cart?.product;

              return (
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
                          {customer?.name ||
                            customer?.email ||
                            "Unknown customer"}
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
                          {customer?.name || customer?.email || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-muted-foreground">Product</span>

                        <span className="text-right font-medium">
                          {product?.name || "Unknown product"}
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

                        <p className="mt-1 text-xl font-bold">
                          {cart?.quantity ?? 0}
                        </p>
                      </div>

                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Price
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          $
                          {(
                            (order.order?.finalPriceInCents ?? 0) / 100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default RetailerOrders;
