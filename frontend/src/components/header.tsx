"use client";

import { useAuth } from "@/hooks/use-auth";
import { CodeXml, Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white/50 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="size-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CodeXml className="text-white text-lg" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodePanel
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              How it Works
            </Link>
            <Link
              href="/reviews"
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Reviews
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Dashboard
            </Link>
          </nav>

          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isAuthenticated ? (
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </Link>
              <Button variant="primary" asChild>
                <Link
                  href="/register"
                  // className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  Get Started
                </Link>
              </Button>
            </div>
          )}

          <button
            className="md:hidden w-6 h-6 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                How it Works
              </Link>
              <Link
                href="/reviews"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Reviews
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer text-center whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
