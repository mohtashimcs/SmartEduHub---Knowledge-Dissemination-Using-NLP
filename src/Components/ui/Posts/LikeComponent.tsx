import { Button } from "@/components/ui/button";
// import { Heart } from "lucide-react";
import Heart from "react-animated-heart";
import { useLikePost } from "./PostOperation";
interface Props {
  PostId: string;
  UserId: string;
}
export const LikeComponent = ({ PostId, UserId }: Props) => {
  const { isLiking, isLiked, handleLike } = useLikePost(PostId, UserId);
  return (
    <>
      <Button
        className={`poppins-semibold border-2 rounded-2xl px-0 py-0 ${
          isLiked
            ? "bg-transparent hover:bg-red-100 text-white border-transparent hover:border-dashed hover:border-red-300"
            : "bg-transparent hover:bg-red-400 hover:border-red-400 hover:border-dashed text-red-900 border-gray-300 "
        }`}
        style={{ display: "inline-flex" }} // Set display property to inline-flex
        onClickCapture={() => {
          handleLike();
        }}
        disabled={isLiking}
      >
        <Heart
          isClick={isLiked}
          onClick={() => {
            handleLike();
          }}
        />
        {/* <span>{isLiked ? "Liked" : "Like"}</span> */}
      </Button>
    </>
  );
};
