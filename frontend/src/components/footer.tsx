import { CodeXml } from "lucide-react";
import Link from "next/link";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="size-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CodeXml className="text-white text-lg" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodePanel
              </span>
            </div>
            <p className="text-gray-600">
              Empowering students to learn better coding through peer
              collaboration and constructive feedback.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                <FaTwitter
                  className="text-blue-600 size-5"
                  fill="currentColor"
                />
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                <FaGithub className="text-blue-600 size-5" />
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                <FaDiscord className="text-blue-600 size-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <div className="space-y-3">
              <Link
                href="/features"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Pricing
              </Link>
              <Link
                href="/reviews"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Reviews
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <div className="space-y-3">
              <Link
                href="/docs"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Documentation
              </Link>
              <Link
                href="/guides"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Guides
              </Link>
              <Link
                href="/blog"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Blog
              </Link>
              <Link
                href="/community"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Community
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <div className="space-y-3">
              <Link
                href="/help"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-100 pt-8 mt-16">
          <div className="flex items-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} CodePanel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
