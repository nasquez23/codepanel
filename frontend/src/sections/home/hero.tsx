"use client";

import Link from "next/link";
import HeroImage from "@/assets/hero.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${HeroImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Collaborate, Learn, and
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Code Together
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join a growing community of students and instructors solving real
              programming challenges. Post your questions, share your code, get
              feedback — or take on assignments and sharpen your skills through
              peer and expert reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer text-center whitespace-nowrap"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => {
                  const howItWorks = document.getElementById("how-it-works");
                  if (howItWorks) {
                    howItWorks.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="border-2 border-blue-200 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all cursor-pointer text-center whitespace-nowrap"
              >
                Learn How It Works
              </Link>
            </div>
            {/* <div className="flex items-center space-x-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">15K+</div>
                <div className="text-gray-500 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-gray-500 text-sm">Code Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-gray-500 text-sm">Satisfaction</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
