import LeftPane from "./SideBars/Left/leftpane.tsx";
import NavBar from "./Header/navbar.tsx";
import RightPane from "./SideBars/Right/rightpane.tsx";
import { Outlet } from "react-router-dom";
export default function MainPage() {
  return (
    <>
      <div className="flex flex-col w-full h-full overflow-visible overflow-x-hidden space-y-16">
        <div className="fixed z-50 w-full">
          <NavBar />
        </div>
        <div className="flex h-[95%] w-full bg-[#dfe3ee] justify-center overflow-auto [&::-webkit-scrollbar]:hidden max-sm:block">
          <LeftPane />
          <div className="flex flex-col space-y-2 items-center justify-center w-[50%] border-l-2 border-r-2 border-gray-400 text-white text-xl max-sm:w-full">
            <Outlet />
          </div>
          <RightPane />
        </div>
      </div>
    </>
  );
}
