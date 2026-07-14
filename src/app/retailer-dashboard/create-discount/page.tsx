import RetailerDashboardForm from "@/components/retailer-dashboard/create-discount";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Discount",
  description: "You are creating a discount",
};

const CreateDiscount = () => {
  return (
    <main>
      <div className="w-[60vw] flex h-full items-center justify-center self-center justify-self-center">
        <RetailerDashboardForm />
      </div>
    </main>
  );
};

export default CreateDiscount;
