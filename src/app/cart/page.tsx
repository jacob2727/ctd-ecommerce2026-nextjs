import CheckoutButton from "@/components/checkout";
import QuantityChange from "@/components/quantity-change";
import { Button } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "This is the cart page",
};

const CartPage = async () => {
  const session = await auth0.getSession();
  const { data: cart } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/get`,
    {
      userId: session?.user.sub,
    },
  );

  console.log(cart);

  return (
    <main className="flex flex-col gap-5 items-center justify-center p-5">
      <h1 className="font-bold text-6xl">Cart</h1>
      <ul className="flex flex-col gap-5">
        {cart.map((item: any) => {
          item.showing && (
            <>
              <li
                key={item.id}
                className="shadow p-5 rounded-2xl hover:shadow-2xl transition-all duration-300 ease-in-out w-[50vw] flex justify-between"
              >
                <div className="flex flex-col gap-3">
                  <h2 className="font-bold text-2xl">{item.product.name}</h2>
                  <p>{item.product.description}</p>
                  <p>${(item.product.priceInCents / 100).toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <p>Quantity: {item.quantity}</p>
                  <QuantityChange
                    cartId={item.id}
                    productId={item.product.id}
                  />
                </div>
              </li>
            </>
          );
        })}
      </ul>
      <CheckoutButton cart={cart} />
    </main>
  );
};

export default CartPage;
