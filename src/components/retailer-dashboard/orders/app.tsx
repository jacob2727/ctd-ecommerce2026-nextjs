// @ts-nocheck

"use client";
import { useUser } from "@auth0/nextjs-auth0";
import useUserData from "@/app/hooks/useUserData";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const RetailerOrders = () => {
  const [retailerOrders, setRetailerOrders] = useState([]);
  const session = useUser();
  const sessionId = session?.user?.sub;
  const account = useUserData(sessionId);

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
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [retailerId]);

  console.log(account);
  if (session.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  console.log(`Orders: ${JSON.stringify(retailerOrders)}`);
  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto border-r border-gray-300 px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Retailer Orders
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {retailerOrders.map((order) => (
            <article
              key={order.id}
              className="w-full rounded-xl border border-gray-300 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{order.id}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${order.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Username/Email:</span>{" "}
                  {order.order.user.name ? order.order.user.name : order.order.user.email}
                </p>
                <p>
                  <span className="font-semibold">Completed:</span>{" "}
                  {order.completed ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">Product Name:</span>{" "}
                  {order.order.cart.product.name}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {order.order.cart.quantity}
                </p>

                <p>
                  {console.log(order.finalpriceInCents)}
                  <span className="font-semibold">Price:</span>{" "}
                  {"$" + (parseFloat(order.order.finalPriceInCents) / 100).toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default RetailerOrders;
