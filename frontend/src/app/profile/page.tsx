import { ProfileView } from "@/sections/profile/view";
import { Metadata } from "next";

export default function Profile() {
  return <ProfileView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Profile | CodePanel",
    description: "View your profile on CodePanel.",
  };
}
