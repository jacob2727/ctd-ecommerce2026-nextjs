import RetailerDashboardForm from "@/components/retailer-dashboard/create-discount";
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Discount",
  description: "You are creating a discount",
};

const CreateDiscount = async () => {
  const session = (await auth0.getSession())?.user.sub;
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
    <main>
      <div className="lg:w-[60vw] md:w-[60vw] flex h-full items-center justify-center self-center justify-self-center">
        <RetailerDashboardForm />
      </div>
    </main>
  );
};

export default CreateDiscount;
