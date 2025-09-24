"use client";

import { useAuth } from "@/hooks/use-auth";
import { CodeXml, Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { NotificationsDropdown } from "./notifications/notifications-dropdown";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "./ui/drawer";

export default function Header() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/problems", label: "Problems" },
    { href: "/assignments", label: "Assignments" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  const linkBaseStyles = "transition-colors cursor-pointer whitespace-nowrap";
  const desktopLinkClass = (href: string) =>
    `${linkBaseStyles} ${
      pathname === href ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
    }`;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white/50 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="size-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CodeXml className="text-white text-lg" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodePanel
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={desktopLinkClass(l.href)}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/profile" className={desktopLinkClass("/profile")}>
                Profile
              </Link>
            )}
          </nav>

          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAuthenticated ? (
            <div className="items-center hidden md:flex space-x-3">
              <NotificationsDropdown />
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </Link>
              <Button variant="primary" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          <div className="md:hidden flex items-center space-x-5">
            <NotificationsDropdown />
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="w-6 h-6 flex items-center justify-center cursor-pointer"
                >
                  <Menu />
                </button>
              </DrawerTrigger>
              <DrawerContent className="data-[vaul-drawer-direction=left]:w-[85%]">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="size-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <CodeXml className="text-white text-lg" />
                      </div>
                      <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        CodePanel
                      </span>
                    </Link>
                    <DrawerClose asChild>
                      <button
                        aria-label="Close menu"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </DrawerClose>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((l) => (
                      <DrawerClose asChild key={l.href}>
                        <Link
                          href={l.href}
                          className={
                            pathname === l.href
                              ? "text-blue-600"
                              : "text-gray-700 hover:text-blue-600 transition-colors"
                          }
                        >
                          {l.label}
                        </Link>
                      </DrawerClose>
                    ))}
                    {isAuthenticated && (
                      <DrawerClose asChild>
                        <Link
                          href="/profile"
                          className={
                            pathname === "/profile"
                              ? "text-blue-600"
                              : "text-gray-700 hover:text-blue-600 transition-colors"
                          }
                        >
                          Profile
                        </Link>
                      </DrawerClose>
                    )}
                  </nav>

                  <div className="flex flex-col space-y-2 pt-6">
                    {isLoading ? (
                      <div className="flex items-center text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : isAuthenticated ? (
                      <Button variant="primary" onClick={handleLogout}>
                        Logout
                      </Button>
                    ) : (
                      <>
                        <DrawerClose asChild>
                          <Link
                            href="/login"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            Sign In
                          </Link>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Link
                            href="/register"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all text-center"
                          >
                            Get Started
                          </Link>
                        </DrawerClose>
                      </>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}
