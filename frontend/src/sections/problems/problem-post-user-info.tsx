import ProfilePicture from "@/components/profile-picture";
import { formatDistanceToNow } from "date-fns";
import { ProblemPost } from "@/types/problem-post";

interface ProblemPostUserInfoProps {
  problemPost: ProblemPost;
}

export default function ProblemPostUserInfo({
  problemPost,
}: ProblemPostUserInfoProps) {
  return (
    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
      <ProfilePicture
        profilePictureUrl={problemPost.author.profilePictureUrl}
        firstName={problemPost.author.firstName}
        lastName={problemPost.author.lastName}
        className="size-11"
      />
      <div className="flex flex-col">
        <span className="font-medium text-lg">
          {problemPost.author.firstName} {problemPost.author.lastName}
        </span>
        <span className="text-gray-500">
          {formatDistanceToNow(new Date(problemPost.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
}
