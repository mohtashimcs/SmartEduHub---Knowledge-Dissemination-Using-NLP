import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Timestamp } from "firebase/firestore";
import { Fragment } from "react";

//Comment Interface
interface Comment {
  id: string;
  userPic: string;
  createdAt: Timestamp;
  userName: string;
  text: string;
}

//Prop Interface
interface Props {
  Comments: Comment[];
}
export const UserComments = ({ Comments }: Props) => {
  if (Comments.length === 0) {
    return (
      <>
        <div className="w-full text-center flex flex-col space-y-2">
          <span className="text-red-500 poppins-semibold text-base">
            POST HAS NO COMMENTS.
          </span>
          <span className="poppins-bold text-blue-500 text-xs">
            ADD A COMMENT!{" "}
          </span>
        </div>
      </>
    );
  }
  return (
    <>
      {Comments.map((comment) => (
        <Fragment key={comment.id}>
          <div className="flex space-x-3 mt-4 items-center rounded-xl p-4 overflow-hidden shadow-inner bg-[#dfe3ee] ">
            <div className="flex flex-col items-center shrink-0">
              <Avatar className="bg-gray-500 text-white size-12">
                <AvatarImage
                  src={comment.userPic || "default_avatar_url.png"}
                />
                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
              </Avatar>
              <span className="poppins-regular text-sm ">
                {comment.userName}
              </span>
            </div>
            <div className="flex flex-col w-full">
              <span className="pl-8 text-base text-gray-700 break-words poppins-semibold">
                {comment.text}
              </span>
              {comment.createdAt && (
                <span className="text-right poppins-light text-xs pr-2">
                  {new Date(comment.createdAt.toDate()).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              )}
            </div>
          </div>
          <Separator className="bg-[#89CFF3]" />
        </Fragment>
      ))}
    </>
  );
};
