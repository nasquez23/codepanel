import {
  CodeXml,
  MessageCircleReply,
  ShieldCheck,
  Trophy,
  User,
  Users,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <User />,
      title: "Peer-to-Peer Learning",
      description:
        "Connect with fellow students to review code and share knowledge in a collaborative environment designed for learning.",
    },
    {
      icon: <CodeXml />,
      title: "Smart Code Analysis",
      description:
        "Our intelligent system highlights potential issues and suggests improvements to help you learn better coding practices.",
    },
    {
      icon: <MessageCircleReply />,
      title: "Constructive Feedback",
      description:
        "Receive detailed, helpful feedback on your code with specific suggestions for improvement and best practices.",
    },
    {
      icon: <Trophy />,
      title: "Achievement System",
      description:
        "Track your progress with badges and achievements as you help others and improve your own coding skills.",
    },
    {
      icon: <Users />,
      title: "Study Groups",
      description:
        "Join or create study groups with classmates to collaborate on projects and learn together.",
    },
    {
      icon: <ShieldCheck />,
      title: "Safe Environment",
      description:
        "Learn in a supportive, moderated environment where constructive feedback is encouraged and respected.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Excel at Code Reviews
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built specifically for students, CodeClimb provides all the tools
            you need to learn through peer collaboration and feedback.
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
