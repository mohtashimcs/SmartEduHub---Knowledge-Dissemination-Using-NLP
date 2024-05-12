import { BookUser, Bot, Files, Home, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import useLogout from "@/src/Components/auth/Operations";
import { useState } from "react";

//-------------------------------------------------------
export const Links = () => {
  const location = useLocation();
  const [selectedLink, setSelectedLink] = useState(location.pathname);

  const logOut = useLogout();
  return (
    <div className="flex flex-col items-center border-blue-400 border-2 shadow-xl rounded-xl bg-[#c2e5f3] overflow-hidden">
      <Link
        to="/"
        className={`w-full ${
          selectedLink === "/" ? "bg-slate-300 border-slate-400 border-b-2" : ""
        }`}
        onClick={() => setSelectedLink("/")}
      >
        <div className="flex items-center p-3 space-x-4 hover:bg-slate-200">
          <Home />
          <span>Home</span>
        </div>
      </Link>
      <Separator className="bg-[#87CEEB]" />
      <Link
        to="/Chats"
        className={`w-full ${
          selectedLink === "/Chats"
            ? "bg-slate-300 border-slate-400 border-b-2"
            : ""
        }`}
        onClick={() => setSelectedLink("/Chats")}
      >
        <div className="flex items-center p-3 space-x-4 hover:bg-slate-200">
          <Bot />
          <span>ChatBot</span>
        </div>
      </Link>
      <Separator className="bg-[#87CEEB]" />
      <Link
        to="/Members"
        className={`w-full ${
          selectedLink === "/Members"
            ? "bg-slate-300 border-slate-400 border-b-2"
            : ""
        }`}
        onClick={() => setSelectedLink("/Members")}
      >
        <div className="flex w-full items-center p-3 space-x-4 hover:bg-slate-200">
          <BookUser />
          <span>Members</span>
        </div>
      </Link>
      <Separator className="bg-[#87CEEB]" />
      <Link
        to="/Files"
        className={`w-full ${
          selectedLink === "/Files"
            ? "bg-slate-300 border-slate-400 border-b-2"
            : ""
        }`}
        onClick={() => setSelectedLink("/Files")}
      >
        <div className="flex w-full items-center p-3 space-x-4 hover:bg-slate-200">
          <Files />
          <span>Files</span>
        </div>
      </Link>
      <Separator className="bg-[#87CEEB]" />
      <a href="" className="w-full text-left" onClick={logOut}>
        <div className="flex items-center p-3 space-x-4 hover:bg-slate-200">
          <LogOut />
          <span>Logout</span>
        </div>
      </a>
    </div>
  );
};
