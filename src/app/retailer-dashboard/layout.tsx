import RetailerDashboardSidebar from "@/components/retailer-dashboard/sidebar/app";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-5 gap-15">
      <div className="col-span-1">
        <RetailerDashboardSidebar />
      </div>
      <div className="col-span-4">{children}</div>
    </div>
  );
};

export default Layout;
