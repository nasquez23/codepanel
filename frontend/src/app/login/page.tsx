import { LoginView } from "@/sections/auth/view";
import { Metadata } from "next";

export default function LoginPage() {
  return <LoginView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Login | CodePanel",
    description: "Login to your CodePanel account to start reviewing code",
  };
}
