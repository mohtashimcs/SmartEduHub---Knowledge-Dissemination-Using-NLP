import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PostView } from "../Posts/PostView";
import { FileView } from "../Files/FileView";

interface Props {
  FetchId: string;
}
export const QueryMenu = ({ FetchId }: Props) => {
  const [currentView, setCurrentView] = useState("posts"); // 'posts' is default
  const getButtonClass = (viewName: any) => {
    return `bg-[#87CEEB] border-gray-600 border-2 font-semibold text-black hover:bg-slate-300 border-dashed ${
      currentView === viewName
        ? "hover:border-dashed border-double bg-gray-400 text-white hover:text-black"
        : ""
    }`;
  };
  return (
    <>
      <div className="flex justify-center border-b-2 border-gray-300 space-x-4 w-full pb-2">
        <Button
          className={getButtonClass("posts")}
          onClick={() => setCurrentView("posts")}
        >
          Posts
        </Button>
        <Button
          className={getButtonClass("files")}
          onClick={() => setCurrentView("files")}
        >
          Files
        </Button>
      </div>
      {currentView === "posts" ? (
        <PostView fetchAll={false} fetchId={FetchId} />
      ) : (
        <FileView showPersonal={true} fetchId={FetchId} />
      )}
    </>
  );
};
