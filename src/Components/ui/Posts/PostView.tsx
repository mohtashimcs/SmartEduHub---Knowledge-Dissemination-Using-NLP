import "react-toastify/dist/ReactToastify.css";
import { HashLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator.tsx";
import { CommentView } from "./CommentView";
import { LikeComponent } from "./LikeComponent";
import { MediaView } from "./MediaView";
import { PostHeader } from "./PostHeader";
import { useFetchPosts } from "./PostOperation";
import { useAppSelector } from "@/src/app/hooks";

//--------------------------------------------------
interface Props {
  fetchId: string;
  fetchAll: boolean;
}
export const PostView = ({ fetchId, fetchAll }: Props) => {
  const { loading, posts, hasPost } = useFetchPosts(fetchAll, fetchId);
  const userId = useAppSelector((state) => state.profile.userId);
  if (loading)
    return (
      <div className="flex justify-center items-center w-full pt-14">
        <HashLoader color="#36d7b7" />
      </div>
    );

  return (
    <>
      <div className="poppins-regular w-full h-fit flex items-center flex-col flex-1">
        {hasPost ? (
          <div className="flex items-center flex-col flex-1 w-full max-w-screen-lg">
            {" "}
            {/* Limiting the width for better readability */}
            {userId &&
              posts.map((post) => {
                const hasSupportedMedia = post.fileUrls?.some(
                  (url: string) =>
                    url.includes(".jpg") ||
                    url.includes(".jpeg") ||
                    url.includes(".png") ||
                    url.includes(".mp4") ||
                    url.includes(".mov") ||
                    url.includes(".image/jpg") ||
                    url.includes(".image/jpeg") ||
                    url.includes(".image/png") ||
                    url.includes(".image/mp4") ||
                    url.includes(".image/mov") ||
                    url.includes("_undefined")
                );
                return (
                  <div key={post.id} className="w-full max-w-[90%] h-fit">
                    {" "}
                    {/* Adjusting width */}
                    <Separator className="bg-gray-400 mt-4" />
                    <Card className="border-2 shadow-2xl bg-[#deeff7] border-blue-400 rounded-3xl mt-4">
                      <CardHeader className="border-b-2 border-blue-200">
                        <CardTitle>
                          <PostHeader
                            UserName={post.userName}
                            UserProfilePic={post.userPic}
                            PostTime={post.createdAt}
                            PostCategory={post.category}
                          />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center text-lg overflow-hidden space-y-2">
                        <div className="w-full text-left">
                          <span className="text-[#163848] poppins-regular">
                            {post.content}
                          </span>
                        </div>
                        {hasSupportedMedia && (
                          <MediaView fileUrls={post.fileUrls} />
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-center mt-3 space-x-3">
                        <div className="flex flex-col items-center">
                          {/* Like Component */}
                          <LikeComponent PostId={post.id} UserId={userId} />
                          <span className="poppins-light text-xs">
                            {post.likes || 0} likes
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          {/* Comment View Component */}
                          <CommentView PostId={post.id} />
                          <span className="poppins-light text-xs">
                            {post.comments || 0} comments
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center rounded-md bg-slate-100 w-full max-w-screen-lg p-4">
            {" "}
            {/* Adjusting width and adding padding */}
            <span className="text-blue-500 poppins-bold text-lg">
              No Posts to display.
            </span>
          </div>
        )}
      </div>
    </>
  );
};
