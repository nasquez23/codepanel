import Link from "next/link";
import HowItWorksStep1 from "@/assets/how-it-works-step-01.jpg";
import HowItWorksStep2 from "@/assets/how-it-works-step-02.jpg";
import HowItWorksStep3 from "@/assets/how-it-works-step-03.jpg";
import HowItWorksStep4 from "@/assets/how-it-works-step-04.jpg";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Submit Your Code",
      description:
        "Upload your code project or assignment and add context about what you're looking for feedback on.",
      image: HowItWorksStep1.src,
    },
    {
      step: "02",
      title: "Get Matched with Peers",
      description:
        "Our smart matching system connects you with other students at similar skill levels for meaningful reviews.",
      image: HowItWorksStep2.src,
    },
    {
      step: "03",
      title: "Review and Learn",
      description:
        "Participate in constructive code reviews, giving and receiving feedback to improve together.",
      image: HowItWorksStep3.src,
    },
    {
      step: "04",
      title: "Track Progress",
      description:
        "Monitor your improvement over time with detailed analytics and achievement badges.",
      image: HowItWorksStep4.src,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How CodePanel
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works for You
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started with peer code reviews is simple. Follow these four
            steps to begin your coding journey.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 max-w-lg">
                <div className="flex items-center mb-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mr-4">
                    {step.step}
                  </span>
                  <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 flex-1"></div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-80 object-cover object-top rounded-3xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent rounded-3xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/register"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap"
          >
            Start Your Coding Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
