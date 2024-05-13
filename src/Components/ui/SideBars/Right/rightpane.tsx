import { Separator } from "@/components/ui/separator";
import { ChatView } from "./ChatView";
import { CreateGroup } from "./CreateGroup";
import { SearchGroup } from "./SearchGroup";
import { RequestInfo } from "./RequestInfo";

export default function RightPane() {
  return (
    <>
      <div className="flex flex-col w-full sm:w-[22%] mt-2 space-y-2 p-4 max-sm:hidden">
        {/* Create Group Component */}
        <CreateGroup />
        <Separator className="bg-gray-300" />
        <SearchGroup />
        <Separator className="bg-gray-300" />
        <div className="flex flex-col h-auto sm:h-fit text-wrap items-start space-y-2 p-2 border-2 border-blue-200 shadow-xl rounded-3xl overflow-y-auto overflow-x-hidden bg-[#87CEEB]">
          <div className="poppins-semibold flex justify-between items-center bg-white p-2 px-4 w-full text-lg rounded-xl bg-opacity-80 backdrop-filter backdrop-blur shadow-inner">
            Discussions
            <RequestInfo />
          </div>
          {/* Discussions List View */}
          <ChatView />
        </div>
      </div>
    </>
  );
}
