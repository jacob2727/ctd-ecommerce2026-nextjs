import { Metadata } from "next";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Success Page",
  description: "This is the success page after a successful payment.",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SuccessPage = async ({ params }: { params: any }) => {
  const { id } = await params;
  const session = await stripe.checkout.sessions.retrieve(id, {
    expand: ["line_items"],
  });

  console.log(session);

  return (
    <main className="flex flex-col gap-3 p-5">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p>Payment Status: {session.payment_status}</p>
      <p>Products:</p>
      <ul className="flex flex-col gap-2 pl-5">
        {session.line_items?.data.map((item) => (
          <li key={item.id}>
            {item.description} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default SuccessPage;
