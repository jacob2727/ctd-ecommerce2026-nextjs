"use client";

import useUserData from "@/app/hooks/useUserData";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const RetailerDashboardSidebar = () => {
  const session = useUser();
  const data = useUserData(session.user?.sub);
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function run() {
      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/link`,
        // @ts-expect-error
        { accountId: data.accountId },
      );
      setUrl(res.url);
    }
    run();
  });

  const menuItems = [
    { label: "View Monetary Dashboard", href: url },
    { label: "Create Product", href: "/" },
    { label: "Edit Product Name", href: "/" },
    { label: "Edit Product Description", href: "/" },
    {
      label: "Create Discount Offer",
      href: "/retailer-dashboard/create-discount",
    },
    { label: "All Discounts", href: "/retailer-dashboard/discounts" },
  ];

  return (
    <nav className="h-full w-[20vw] flex-none bg-white border-r-2 border-gray-200 text-black flex flex-col">
      <div className="px-6 py-8 border-b-2 border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
      </div>
      <ul className="flex-1 flex flex-col divide-y divide-gray-200">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="px-6 py-4 text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 flex items-center gap-3 group"
          >
            <span className="w-1 h-6 bg-blue-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {item.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default RetailerDashboardSidebar;
