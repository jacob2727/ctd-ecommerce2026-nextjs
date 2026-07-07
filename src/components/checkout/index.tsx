"use client";
import axios from "axios";
import { Button } from "../ui/button";

const CheckoutButton = ({ cart }: { cart: any }) => {
  return (
    <Button
      onClick={async () => {
        const { data: res } = await axios.post("/api/pay", {
          cart,
        });

        window.location.href = res.url;
      }}
    >
      Checkout
    </Button>
  );
};

export default CheckoutButton;
