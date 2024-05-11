import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/src/Firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Props {
  UserID: string;
}
export const UserProfile = ({ UserID }: Props) => {
  const [profilePic, setProfilePic] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const fetchUserById = async (userId: string) => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", userId)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const userName: string = userData?.userName;
        const profile: string = userData?.ProfilePic;
        //setProfilePic(profile);
        setProfilePic(profile);
        setUserName(userName);
        return userData;
      } else {
        console.error("User document not found in Firestore");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      return null;
    }
  };

  useEffect(() => {
    if (UserID) {
      fetchUserById(UserID);
    }
  }, [UserID]);
  return (
    <div className="w-full flex justify-center mt-[3%]">
      {/* <div className="flex w-[95%] items-center border-2 flex-col border-blue-300 shadow-xl rounded-3xl p-2 bg-[#cbe3ec] overflow-hidden">
          <div className="flex w-full justify-center items-center">
            <Separator className="bg-gray-400" />
            <Avatar className="size-2/6 border-2 border-gray-500 ">
              <AvatarImage src={profilePic} />
              <AvatarFallback>{userName ? userName[0] : "U"}</AvatarFallback>
            </Avatar>
            <Separator className="bg-gray-400" />
          </div>
          <h2 className="font-sans text-3xl font-semibold pl-2 truncate text-gray-700">
            {userName}
          </h2>
        </div> */}

      <div className="relative flex w-[95%] items-center justify-center flex-col shadow-xl rounded-3xl border-transparent p-2 bg-[#89CFF3] overflow-hidden">
        <div className="w-full h-28 bg-[#CDF5FD] rounded-t-2xl"></div>
        <div className="w-full h-32 border-t-2 border-gray-600 bg-[#89CFF3] rounded-b-2xl"></div>

        <div className="absolute flex flex-col justify-center items-center">
          <Avatar className="h-[33%] w-44 border-2 border-gray-500">
            <AvatarImage src={profilePic} />
            <AvatarFallback>{userName ? userName[0] : "U"}</AvatarFallback>
          </Avatar>
          <h2
            className="transform [-translate-x-1/2] poppins-bold text-3xl font-semibold truncate text-gray-800 mt-2"
            style={{ letterSpacing: "0.3px" }}
          >
            {userName}
          </h2>
        </div>
      </div>
    </div>
  );
};
