"use client";

import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const QuantityChange = ({
  cartId,
  productId,
  cart,
}: {
  cartId: string;
  productId: string;
  cart: any;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateQuantity = async (type: "increment" | "decrement") => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/${type}`, {
        cartId,
        productId,
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {cart.quantity < cart.product.stock && (
        <Button
          disabled={isPending}
          onClick={() => updateQuantity("increment")}
        >
          {isPending ? "Updating..." : "Add"}
        </Button>
      )}

      <Button disabled={isPending} onClick={() => updateQuantity("decrement")}>
        {isPending ? "Updating..." : "Subtract"}
      </Button>
    </div>
  );
};

export default QuantityChange;
