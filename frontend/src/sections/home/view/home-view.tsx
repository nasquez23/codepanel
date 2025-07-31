import Header from "@/components/header";
import Hero from "../hero";
import Footer from "@/components/footer";
import Features from "../features";
import HowItWorks from "../how-it-works";

export default function HomeView() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}
