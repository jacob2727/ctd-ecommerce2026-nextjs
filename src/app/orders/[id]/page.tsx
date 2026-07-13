import axios from "axios";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Order",
  description: "View your order",
};

const OrdersIdPage = async ({ params }: { params: any }) => {
  const { id } = await params;
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/delivery/order-id`,
    { orderId: id },
  );
  console.log(data);
  return (
    <main className="flex flex-col gap-5 p-5">
      <p>Order ID: {data.order.id}</p>
      <p>Order Status: {data.order.status}</p>
      <p>Product:</p>
      <ul className="pl-5 flex flex-col gap-5">
        <li>
          {data.order.cart.product.name} - {data.order.cart.quantity}
        </li>
        <li>${(data.order.cart.product.priceInCents / 100).toFixed(2)}</li>
      </ul>
    </main>
  );
};

export default OrdersIdPage;
