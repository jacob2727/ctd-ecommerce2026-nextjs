"use client";

import Link from "next/link";

const RetailerDashboardSidebar = () => {
  return (
    <ul className="h-lvh w-[20vw] border-r  flex-none text-black  border-gray-300 flex flex-col items-stretch justify-around hover:cursor-pointer ">
      <Link
        className="border-b border-gray-300  w-full self-stretch text-center flex justify-center bg-gray-600 flex-1"
        href={"/"}
      >
        Text1
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center flex justify-center bg-gray-600 flex-1"
        href={"/"}
      >
        Text12
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center flex justify-center bg-gray-600 flex-1"
        href={"/"}
      >
        Text13
      </Link>
      <Link
        className="border-b border-gray-300  w-full self-stretch text-center  flex justify-center bg-gray-600 flex-1"
        href={"/"}
      >
        Text14
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center flex justify-center bg-gray-600 flex-1"
        href={"/"}
      >
        Text15
      </Link>
      <Link
        className="border-b border-gray-300 w-full self-stretch text-center  flex justify-center bg-gray-600 flex-1"
        href={"/"}
      >
        Text2
      </Link>
      <Link
        className="border-b border-gray-300  w-full self-stretch text-center  flex justify-center bg-gray-600 flex-1"
        href={"/"}
      >
        Text3
      </Link>
    </ul>
  );
};

export default RetailerDashboardSidebar;
