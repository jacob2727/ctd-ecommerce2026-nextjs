import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Popover } from "radix-ui";
import { PopoverContent, PopoverTrigger } from "../ui/popover";

const Header = async () => {
  const session = await auth0.getSession();

  const userName = session?.user?.name || session?.user?.email || "Account";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <div className="rounded-lg bg-primary p-2 text-primary-foreground">
            <Store className="h-4 w-4" />
          </div>

          <span>Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:flex">
            <Link href="/">
              <Package className="mr-2 h-4 w-4" />
              Products
            </Link>
          </Button>

          {session?.user ? (
            <>
              <Button asChild variant="ghost" size="icon">
                <Link href="/cart" aria-label="Open cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>

              <Popover openDelay={100} closeDelay={150}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="max-w-52 gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>

                    <span className="hidden truncate sm:inline">
                      {userName}
                    </span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-72 p-3">
                  <div className="px-2 py-2">
                    <p className="text-sm font-semibold">
                      {session.user.name || "Your account"}
                    </p>

                    {session.user.email && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-1">
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href="/cart">
                        <ShoppingCart className="mr-3 h-4 w-4" />
                        Cart
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href="/orders">
                        <Package className="mr-3 h-4 w-4" />
                        Orders
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href="/retailer-dashboard">
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        Retailer Dashboard
                      </Link>
                    </Button>
                  </div>

                  <Separator className="my-2" />

                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <a href="/auth/logout">
                      <LogOut className="mr-3 h-4 w-4" />
                      Log out
                    </a>
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Button asChild>
              <a href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </a>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
