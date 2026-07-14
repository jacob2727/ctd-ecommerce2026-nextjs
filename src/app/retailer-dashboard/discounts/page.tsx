import ShowAllDiscounts from "@/components/retailer-dashboard/discounts";
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discounts",
  description: "View all discounts for all of your products",
};

const DisoucntsPage = async () => {
  const session = await auth0.getSession();
  const data = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/discounts/get`,
    { userId: session?.user?.sub },
  );

  const response = data.data;

  return (
    <main>
      <ShowAllDiscounts discounts={response} />
    </main>
  );
};

export default DisoucntsPage;
