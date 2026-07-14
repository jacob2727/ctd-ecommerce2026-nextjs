import { auth0 } from "@/lib/auth0";
import axios from "axios";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orders",
  description: "View and manage your orders",
};

const OrdersPage = async () => {
  const session = await auth0.getSession();

  const { data: orders } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/get`,
    {
      userId: session?.user.sub,
    },
  );

  console.log(orders);

  return (
    <main className="flex flex-col gap-5 items-center justify-center p-5">
      <h1 className="font-bold text-6xl">Orders</h1>
      <ul className="flex flex-col gap-5 w-[50vw]">
        {orders.map((order: any) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="rounded-2xl border hover:shadow-2xl transition-all hover:scale-101 p-5 w-full flex flex-col gap-3"
            >
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${(order.finalPriceInCents / 100).toFixed(2)}</p>
              <p>Date: {new Date(order.timestamp).toLocaleDateString()}</p>
              <h3 className="font-bold text-xl mt-3">Item:</h3>
              <ul className="grid grid-cols-3 gap-3 pl-5">
                {
                  <li key={order.cart.id} className="flex flex-col gap-2">
                    <p className="font-bold text-xl">
                      {order.cart.product.name}
                    </p>
                    <p>Quantity: {order.cart.quantity}</p>
                    <Image
                      src="/globe.svg"
                      alt={order.cart.product.name}
                      width={100}
                      height={100}
                    />
                  </li>
                }
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default OrdersPage;
