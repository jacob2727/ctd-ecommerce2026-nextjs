"use client";

import { useUser } from "@auth0/nextjs-auth0";
import useUserData from "@/app/(main)/hooks/useUserData";

const RetailerOrders = () => {
  const session = useUser();
  const sessionId = session?.user?.sub;

  // @ts-ignore
  const { userData } = useUserData(sessionId);

  //@ts-ignore
  const retailerId = userData;
  console.log("retailerId: ", retailerId);
  if (session.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto border-r border-gray-300 px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Retailer Orders
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <article
              key={order.id}
              className="w-full rounded-xl border border-gray-300 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md "
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{order.id}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Username/Email:</span>{" "}
                  {order.username}
                </p>

                <p>
                  <span className="font-semibold">Completed:</span>{" "}
                  {order.completed ? "Yes" : "No"}
                </p>
                <p>
                  <span>
                    Items:
                    {order.items
                      .map((item) => {
                        return " " + item.name + " : " + item.quantity;
                      })
                      .join(", ")}
                  </span>
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
