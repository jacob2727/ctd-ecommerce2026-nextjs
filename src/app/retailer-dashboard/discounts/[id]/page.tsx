import EditDiscount from "@/components/retailer-dashboard/discounts/edit";
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import { Metadata } from "next";
import { redirect } from "next/navigation";

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
  const session = (await auth0.getSession())?.user;
  const responseRetailer = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/`,
    {
      userId: session,
    },
  );

  if (!responseRetailer.data.retailer) {
    redirect("/start");
  }
  const { data: data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/discounts/get/id`,
    { id },
  );

  console.log(data);

  return (
    <main>
      <EditDiscount data={data} />
    </main>
  );
};

export default DiscountsByIdPage;
