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
      <AvatarImage src={profilePictureUrl} className="object-cover" />
      <AvatarFallback>
        {firstName.charAt(0)}
        {lastName.charAt(0)}
      </AvatarFallback>
    </Avatar>
  ) : (
    <User
      className={cn(
        "rounded-full border-2 text-gray-400 p-2 border-gray-300 bg-white",
        className
      )}
    />
  );
}
