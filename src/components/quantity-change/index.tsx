"use client";
import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const QuantityChange = ({
  cartId,
  productId,
}: {
  cartId: string;
  productId: string;
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={async () => {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/increment`,
            {
              cartId,
              productId,
            },
          );
          router.refresh();
        }}
      >
        Add
      </Button>
      <Button
        onClick={async () => {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/decrement`,
            {
              cartId,
              productId,
            },
          );
          router.refresh();
        }}
      >
        Subtract
      </Button>
    </div>
  );
};

export default QuantityChange;
