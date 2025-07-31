import { ForgotPasswordView } from "@/sections/auth/view";
import { Metadata } from "next";

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Forgot Password | CodePanel",
    description: "Forgot your password? Reset it here",
  };
}
