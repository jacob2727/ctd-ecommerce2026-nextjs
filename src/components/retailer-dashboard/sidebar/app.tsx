"use client";

import Link from "next/link";

const RetailerDashboardSidebar = () => {
  return (
    <ul className="h-full w-[20vw] flex-none border-r border-gray-300 text-black flex flex-col items-stretch hover:cursor-pointer">
      <Link
        className="border-b border-gray-300  w-full self-stretch text-center flex justify-center items-center flex-1"
        href={"/"}
      >
        Create Product
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center flex justify-center items-center flex-1"
        href={"/"}
      >
        Edit Product Name
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center flex justify-center items-center  flex-1"
        href={"/"}
      >
        Edit Product Description
      </Link>
      <Link
        className="border-b border-gray-300  w-full self-stretch text-center  flex justify-center items-center flex-1"
        href={"/retailer-dashboard/create-discount"}
      >
        Create Discount Offer
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center flex justify-center items-center flex-1"
        href={"/retailer-dashboard/discounts"}
      >
        All Discounts
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center  flex justify-center items-center  flex-1"
        href={"/"}
      >
        Text2
      </Link>
      <Link
        className="border-b border-gray-300  w-full self-stretch text-center  flex justify-center items-center flex-1"
        href={"/"}
      >
        Text3
      </Link>
    </ul>
  );
};

export default RetailerDashboardSidebar;
