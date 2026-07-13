import { auth0 } from "@/lib/auth0";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { redirect } from "next/navigation";
import RetailerOrders from "@/components/retailer-dashboard/orders/app";
import RetailerDashboardSidebar from "@/components/retailer-dashboard/sidebar/app";
import SideBarRetailerData from "@/components/retailer-dashboard/quickData/app";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retailer Dashboard",
  description: "This is the retailer dashboard",
};

const RetailerDashboard = async () => {
  const session = (await auth0.getSession())?.user?.sub;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard`,
    {
      userId: session,
    },
  );

  console.log(response.data);

  if (!response.data.retailer) {
    redirect("/start");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <RetailerDashboardSidebar />
      <RetailerOrders />
      <SideBarRetailerData />
    </div>
  );
};

export default RetailerDashboard;
