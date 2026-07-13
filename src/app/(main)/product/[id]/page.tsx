import { Metadata } from "next";
import axios from "axios";
import AddToCartButton from "@/components/add-to-cart-button";

export const metadata: Metadata = {
  title: "Product",
  description: "This is our CTD Project Product page",
};

const ProductIdPage = async ({ params }: { params: any }) => {
  const { id } = await params;

  const { data: response } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/get/${id}`,
  );

  console.log(response);

  return (
    <main className="flex flex-col gap-5 items-center justify-center p-5">
      <h1 className="font-bold text-6xl">{response.name}</h1>
      <p className="text-gray-600">{response.description}</p>
      <AddToCartButton />
    </main>
  );
};

export default ProductIdPage;
