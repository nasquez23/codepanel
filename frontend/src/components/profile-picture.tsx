import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface ProfilePictureProps {
  profilePictureUrl?: string;
  firstName: string;
  lastName: string;
  className?: string;
}

export default function ProfilePicture({
  profilePictureUrl,
  firstName,
  lastName,
  className = "size-5",
}: ProfilePictureProps) {
  return profilePictureUrl ? (
    <Avatar className={cn("rounded-full", className)}>
      <AvatarImage src={profilePictureUrl} />
      <AvatarFallback>
        {firstName.charAt(0)}
        {lastName.charAt(0)}
      </AvatarFallback>
    </Avatar>
  ) : (
    <User className={cn("rounded-full border border-gray-800", className)} />
  );
}
