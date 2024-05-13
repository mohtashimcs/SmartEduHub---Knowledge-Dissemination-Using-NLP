import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronsDown, Settings, UserRound, LogOut } from "lucide-react";

import useLogout from "@/src/Components/auth/Operations";
import { ProfileManage } from "./ProfileManage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/src/app/hooks";
import { Link } from "react-router-dom";

export const MenuScreen = () => {
  const logOut = useLogout();
  const dP = useAppSelector((state) => state.profile.picture);
  const displayName = useAppSelector((state) => state.profile.name);
  const userId = useAppSelector((state) => state.profile.userId);
  return (
    <>
      <div className="flex items-center gap-1">
        <Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={dP} />
                  <AvatarFallback>
                    {displayName ? displayName[0] : "US"}
                  </AvatarFallback>
                </Avatar>
                <ChevronsDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={`/Profile/${userId}`}>
                <DropdownMenuItem>
                  <UserRound className="poppins-semibold" />
                  Profile
                </DropdownMenuItem>
              </Link>

              <SheetTrigger className="w-full mr-1">
                <DropdownMenuItem>
                  <Settings className="w-4 mr-1" />
                  Manage
                </DropdownMenuItem>
              </SheetTrigger>
              <DropdownMenuItem onClick={logOut}>
                <LogOut className="w-4 space-y-1" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetContent className="bg-[#CDF5FD]">
            <SheetHeader>
              <SheetTitle className="poppins-bold text-4xl">
                Your Profile
              </SheetTitle>
              <SheetDescription>
                <ProfileManage />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
