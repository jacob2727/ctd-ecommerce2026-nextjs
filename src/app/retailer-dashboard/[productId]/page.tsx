import axios from "axios";
import ProductProfile from "@/components/retailer-dashboard/product-info/app";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function SingleProductPage({ params }: PageProps) {
  const session = (await auth0.getSession())?.user?.sub;
  const responseRetailer = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard`,
    {
      userId: session,
    },
  );

  if (!responseRetailer.data.retailer) {
    redirect("/start");
  }
  const { productId } = await params;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/get-product`,
    {
      productId,
    },
  );
  const Product = response.data;
  return (
    <div>
      {/* @ts-ignore */}
      <ProductProfile product={Product} />
    </div>
  );
}
