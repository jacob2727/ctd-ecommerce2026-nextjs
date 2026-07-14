import axios from "axios";
import ProductProfile from "@/components/retailer-dashboard/product-info/app";
type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function SingleProductPage({ params }: PageProps) {
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
