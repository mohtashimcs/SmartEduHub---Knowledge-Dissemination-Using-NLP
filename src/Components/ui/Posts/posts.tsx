import React from "react";
import { CreateView } from "./CreateView";
import { PostView } from "./PostView";

function Posts() {
  //const [catg, setCatg] = useState<string | null>("");

  return (
    <>
      <div className="w-full h-full mt-[4%] space-y-4 flex  border-gray-400 flex-col items-center">
        {/* Create Post Component */}
        <CreateView />
        {/* Post View Component*/}
        <PostView fetchId="" fetchAll={true} />
      </div>
    </>
  );
}
const MemoizedPosts = React.memo(Posts);

export default MemoizedPosts;
