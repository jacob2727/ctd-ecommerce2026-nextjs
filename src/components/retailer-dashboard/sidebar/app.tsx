"use client";

import useUserData from "@/app/hooks/useUserData";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const RetailerDashboardSidebar = () => {
  const session = useUser();
  const account = useUserData(session.user?.sub);
  const [url, setUrl] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function run() {
      // @ts-ignore
      if (!account?.accountId) {
        return;
      }

      try {
        const { data: res } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/retailer-dashboard/link`,
          // @ts-ignore
          { accountId: account.accountId },
        );

        setUrl(res.url);
      } catch (error) {
        console.error("Failed to load retailer link:", error);
      }
    }
    run();
  }, [account]);

  const earningsHref = url || "/retailer-dashboard";

  const menuItems = [
    { label: "Main Dashboard Page", href: "/retailer-dashboard" },
    { label: "Earnings", href: earningsHref },
    { label: "Create Product", href: "/retailer-dashboard/create-product" },
    { label: "Products", href: "/retailer-dashboard/view-products" },

    {
      label: "Create Discount Offer",
      href: "/retailer-dashboard/create-discount",
    },
    { label: "All Discounts", href: "/retailer-dashboard/discounts" },
  ];

  // control mount + animation for drawer
  useEffect(() => {
    if (mobileOpen) {
      setDrawerMounted(true);
      // next frame open animation
      requestAnimationFrame(() => setDrawerOpen(true));
      // lock body scroll while drawer is mounted
      document.body.style.overflow = "hidden";
    } else {
      setDrawerOpen(false);
      const id = setTimeout(() => setDrawerMounted(false), 200);
      // restore body scroll
      document.body.style.overflow = "";
      return () => clearTimeout(id);
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Sticky Menu button for mobile (overlap content) */}
      {/* Mobile header (fixed at bottom) */}
      <header className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <Button variant="default" size="sm" onClick={() => setMobileOpen(true)}>
          Menu
        </Button>
      </header>

      {/* Desktop sidebar (unchanged) */}
      <nav className="hidden md:flex h-full w-[20vw] flex-none bg-white border-r-2 border-gray-200 text-black flex flex-col">
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

      {/* Mobile drawer (animated slide-in) */}
      {drawerMounted && (
        <div className="fixed inset-0 z-50">
          <div
            className={`fixed inset-0 bg-black/40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setMobileOpen(false)}
          />

          <aside
            className={`fixed left-0 top-0 bottom-0 w-72 bg-white p-4 transform transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dashboard</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </Button>
            </div>

            <ul className="flex flex-col divide-y divide-gray-200">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-3"
                >
                  <span className="w-1 h-6 bg-blue-500 rounded" />
                  {item.label}
                </Link>
              ))}
            </ul>
          </aside>
        </div>
      )}
      {/* spacer so page content isn't covered by fixed bottom header on mobile */}
      <div className="md:hidden h-14" />
    </>
  );
};

export default RetailerDashboardSidebar;
