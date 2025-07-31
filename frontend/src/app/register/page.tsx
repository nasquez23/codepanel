import { RegisterView } from "@/sections/auth/view";
import { Metadata } from "next";

export default function RegisterPage() {
  return <RegisterView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Register | CodePanel",
    description: "Register for a CodePanel account to start reviewing code",
  };
}
