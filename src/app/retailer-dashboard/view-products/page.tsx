import RetailerAllProducts from "@/components/retailer-dashboard/view-products/app";
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import { redirect } from "next/navigation";

const retailerProducts = async () => {
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
  return (
    <div>
      <RetailerAllProducts />
    </div>
  );
};

export default retailerProducts;
