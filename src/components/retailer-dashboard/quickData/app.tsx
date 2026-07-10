"use client";

import useUserData from "@/app/hooks/useUserData";
import { auth0 } from "@/lib/auth0";
import { useUser } from "@auth0/nextjs-auth0";

const SideBarRetailerData = () => {
  const userId = useUser()?.user?.sub;
  // @ts-ignore
  const retailer = useUserData(userId);
  console.log("quick retailer data: ", retailer);

  return (
    <div className=" flex-none w-64 ">
      alsiumflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-noneflex-none
    </div>
  );
};

export default SideBarRetailerData;
