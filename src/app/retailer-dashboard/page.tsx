import { auth0 } from "@/lib/auth0";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { redirect } from "next/navigation";
import RetailerOrders from "@/components/retailer-dashboard/orders/app";
import RetailerDashboardSidebar from "@/components/retailer-dashboard/sidebar/app";
import SideBarRetailerData from "@/components/retailer-dashboard/quickData/app";
const retailerDashboard = async () => {
  const session = (await auth0.getSession())?.user?.sub;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard`,
    {
      userId: session,
    },
  );
  if (!response.data) {
    redirect("/start");
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden pt-16">
      <RetailerDashboardSidebar />
      <RetailerOrders />
      <SideBarRetailerData />
    </div>
  );
};

export default retailerDashboard;
