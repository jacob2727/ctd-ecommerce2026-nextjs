import EditDiscount from "@/components/retailer-dashboard/discounts/edit";
import axios from "axios";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Discounts",
  description: "This is a discount",
};

const DiscountsByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const { data: data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/discounts/get/id`,
    { id },
  );

  console.log(data);

  return <main><EditDiscount data={data} /></main>;
};

export default DiscountsByIdPage;
