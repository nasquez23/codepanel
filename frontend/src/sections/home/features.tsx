import {
  ChartNoAxesColumn,
  FileText,
  MessageCircleCode,
  MessagesSquare,
  Users,
  UserStar,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <MessagesSquare />,
      title: "Problem Solving Hub",
      description:
        "Students can post coding problems and challenges to get help from peers and instructors in real-time.",
    },
    {
      icon: <UserStar />,
      title: "Expert Guidance",
      description:
        "Connect with experienced instructors who provide professional insights and detailed explanations.",
    },
    {
      icon: <FileText />,
      title: "Assignment Management",
      description:
        "Instructors can create and distribute assignments while tracking student submissions efficiently.",
    },
    {
      icon: <MessageCircleCode />,
      title: "Submission Reviews",
      description:
        "Comprehensive review system where instructors can evaluate student work and provide detailed feedback.",
    },
    {
      icon: <Users />,
      title: "Collaborative Learning",
      description:
        "Foster a community where students learn from each other through shared problems and solutions.",
    },
    {
      icon: <ChartNoAxesColumn />,
      title: "Progress Tracking",
      description:
        "Monitor student progress and assignment completion with detailed analytics and insights.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Collaborative Learning
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connects students with instructors and peers through problem-solving
            and assignment management in one unified platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="size-12 text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
