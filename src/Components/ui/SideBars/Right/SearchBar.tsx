import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/src/Firebase/firebase";
import "firebase/firestore";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SearchBar = () => {
  interface Groups {
    id: string;
    name: string;
    icon: string;
    createdBy: string;
  }
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<Groups[]>([]);
  const [err, setErr] = useState(false);
  const handleKey = (e: any) => {
    e.code === "Enter" && handleSearch();
  };
  const handleSearch = async () => {
    if (!groupName) {
      //   toast({
      //     variant: "destructive",
      //     title: "Oh! Something went wrong",
      //     description: "Group Name cannot be empty.",
      //   });
      return;
    }
    try {
      //const searchTerm = groupName.toLowerCase();
      const q = query(
        collection(db, "groups"),
        where("low_name", ">=", groupName)
      );
      const userSnapshot = await getDocs(q);
      if (!userSnapshot.empty) {
        const matchingUsers = userSnapshot.docs.map((doc) => {
          const data = doc.data() as Groups;
          return { ...data, id: doc.id };
        });
        //.filter((user) => user.name.toLowerCase().includes(searchTerm));
        // Awant to store the entire user data object in state
        setGroups(matchingUsers);
        setErr(false);
      } else {
        setErr(true);
        console.error("Group document not found in Firestore");
        setGroups([]);
      }
    } catch (error) {
      setErr(true);
      console.error("Error fetching Group data from Firestore:", error);
    }
  };
  useEffect(() => {
    if (groupName.length === 0) {
      setErr(false);
      setGroups([]); // Clears the user info if the search input is empty
    }
    handleSearch();
  }, [groupName]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setGroups([]); // Clear user state
        setGroupName("");
        setErr(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleJoinGroup = async (groupId: string) => {
    try {
      const userId = localStorage.getItem("uid");
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", userId)
      );
      const userSnapshot = await getDocs(userQuery);
      const userDoc = userSnapshot.docs[0];
      if (userSnapshot.empty) {
        return;
      }
      // Update 'groups' array in the user's document:
      await updateDoc(userDoc.ref, {
        groups: arrayUnion(groupId),
      });

      // Add user to the group's 'members' subcollection:
      const memberDocPath = `groups/${groupId}/members/${userId}`;
      const memberDocRef = doc(db, memberDocPath);
      await setDoc(memberDocRef, {
        uid: userId,
        joinedAt: serverTimestamp(),
        role: "member",
      });
      window.location.reload();
      // Success message or UI update to indicate the user joined
    } catch (error) {
      // Handle errors
      console.error("Error joining group:", error);
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full">
        <div className="relative">
          <div
            className="absolute right-3 top-2 cursor-pointer"
            onClick={handleSearch}
          >
            <Search className="text-gray-600" />
          </div>
          <Input
            className="pl-4 w-full poppins-light bg-slate-300 text-xs font-semibold rounded-xl placeholder:text-muted-foreground border-2 border-blue-400 text-md font-sans focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
            placeholder="Find a group..."
            onKeyUp={handleKey}
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
        </div>
        {err && (
          <div
            className=" absolute  z-10 mt-12 flex flex-col items-center w-full"
            ref={wrapperRef}
          >
            <div className="mt-2 border border-solid border-red-600 w-full h-12 poppins-regular text-center text-red-600 bg-white shadow-lg divide-y divide-gray-200 rounded-lg overflow-hidden">
              <span>Group not found.</span>
            </div>
          </div>
        )}
        {groups.length > 0 && (
          <div
            ref={wrapperRef}
            className="absolute z-10 left-10 flex flex-col items-center justify-center w-full mt-8"
          >
            <div className="mt-3 w-[140%] bg-white shadow-lg divide-y divide-gray-200 rounded-lg overflow-hidden">
              {/* Iterate through the users array to render each user */}
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex space-x-2 items-center">
                    <div>
                      {/* Assuming Avatar, AvatarImage, and AvatarFallback are components that can render based on the user data */}
                      <Avatar className="size-10 border-2">
                        <AvatarImage src={group.icon || "default-avatar-url"} />
                        <AvatarFallback>{group.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex w-full justify-between items-center">
                      <article className="w-[80%] flex flex-col items-start ">
                        <h3 className="text-sm poppins-semibold text-gray-600">
                          {group.name}
                        </h3>
                        <span className="text-xs poppins-light text-slate-500">
                          Created By {group.createdBy}
                        </span>
                      </article>
                      <Button
                        className="rounded-3xl poppins-semibold text-black font-semibold bg-[#87CEEB] border-gray-600 hover:bg-slate-400 hover:text-white"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join
                      </Button>
                      {/* You can include other user details here */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
