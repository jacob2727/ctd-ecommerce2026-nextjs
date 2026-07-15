"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "../ui/button";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productAvailable: boolean;
}

const AddToCartButton = ({ productAvailable }: AddToCartButtonProps) => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      <Button
        disabled={!productAvailable}
        onClick={async () => {
          if (!user) {
            router.push("/auth/login");
            return;
          }
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
            userId: user?.sub,
            productId: window.location.pathname.split("/").pop(),
          });
          toast.success("Product added to cart!");
        }}
      >
        Add to Cart
      </Button>
      <Toaster />
    </>
  );
};

export default AddToCartButton;
