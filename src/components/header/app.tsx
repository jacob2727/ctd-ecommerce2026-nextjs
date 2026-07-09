import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";

const Header = async () => {
  const session = await auth0.getSession();

  return (
    <ul className="flex align-items-center justify-between gap-4 p-4 border-b">
      <li>
        <Link className="text-gray-700 hover:underline" href="/">
          Home
        </Link>
      </li>
      {session?.user ? (
        <>
          <HoverCard>
            <HoverCardTrigger>
              <Button>Hello, {session.user.name}</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="/auth/logout" className="hover:underline">
                    Logout
                  </a>
                </li>
                <li>
                  <Link href={"/cart"} className="hover:underline">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link href={"/orders"} className="hover:underline">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href={"/retailer-dashboard"} className="hover:underline">
                    Retailer Dashboard
                  </Link>
                </li>
              </ul>
            </HoverCardContent>
          </HoverCard>
        </>
      ) : (
        <li>
          <a href="/auth/login" className="hover:underline">
            Sign In
          </a>
        </li>
      )}
    </ul>
  );
};

export default Header;
