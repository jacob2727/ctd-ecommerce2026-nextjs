import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  const { cart } = await req.json();
  console.log(cart);
  const filteredCard = cart.filter((cartItem: any) => cartItem.showing);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "pay_by_bank"],
    line_items: filteredCard.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description,
        },
        unit_amount: item.product.priceInCents,
      },
      quantity: item.quantity,
    })),
    metadata: {
      userId: filteredCard[0].user.userId,
      cartIds: JSON.stringify(filteredCard.map((item: any) => item.id)),
    },
    success_url: `${process.env.APP_BASE_URL}/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_BASE_URL}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
