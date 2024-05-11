import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Timestamp } from "firebase/firestore";
interface Props {
  UserName: string;
  UserProfilePic: string;
  PostTime: Timestamp;
  PostCategory: string;
}
export const PostHeader = ({
  UserName,
  UserProfilePic,
  PostTime,
  PostCategory,
}: Props) => {
  return (
    <div className="poppins-extralight flex items-center space-x-2">
      <Avatar>
        <AvatarImage src={UserProfilePic} />
        <AvatarFallback className="border-slate-400 border-2">
          {UserName ? UserName[0] : "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-xl">
          {UserName}
          <span className="text-xs poppins-mono">{PostCategory}</span>
        </span>
        <span className="text-sm poppins-extralight">
          {new Date(PostTime?.toDate()).toLocaleString("en-US", {
            day: "numeric",
            year: "numeric",
            month: "long",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
    </div>
  );
};
