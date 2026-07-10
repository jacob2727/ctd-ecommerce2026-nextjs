"use client";

import { useUser } from "@auth0/nextjs-auth0";
import useUserData from "@/app/hooks/useUserData";

const RetailerOrders = () => {
  const session = useUser();
  const sessionId = session?.user?.sub;

  // @ts-ignore
  const { userData } = useUserData(sessionId);

  const orders = [
    {
      id: "1234",
      user_id: "4321",
      completed: true,
      status: "pending",
      timestamp: Date.now(),
      username: "Katy Perry",
      address: "321 Madeup Ave",
    },
    {
      id: "0987",
      user_id: "7890",
      completed: true,
      status: "completed",
      timestamp: Date.now(),
      username: "Billy Bob",
    },
    {
      id: "0988",
      user_id: "7891",
      completed: true,
      status: "completed",
      timestamp: Date.now(),
      username: "Billy Bob",
    },
  ];

  if (session.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen grow  px-4 py-8 border border-r border-gray-300 ">
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
                  <span className="font-semibold">Username:</span>{" "}
                  {order.username}
                </p>

                <p>
                  <span className="font-semibold">Completed:</span>{" "}
                  {order.completed ? "Yes" : "No"}
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
