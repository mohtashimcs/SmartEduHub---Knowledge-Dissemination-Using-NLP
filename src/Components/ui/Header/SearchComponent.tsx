import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { db } from "@/src/Firebase/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

//-------------------------------------------------------
export const SearchComponent = () => {
  interface User {
    uid: string;
    name: string;
    ProfilePic: string;
  }
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setUsers([]); // Clear user state
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
  const [username, setUsername] = useState("");
  const [err, setErr] = useState(false);
  const handleKey = (e: any) => {
    e.code === "Enter" && handleSearch();
  };
  // Assuming the state and its setter for holding the fetched user data is declared like so:
  const [user, setUsers] = useState<User[]>([]);
  const handleSearch = async () => {
    if (!username) return;
    try {
      const q = query(
        collection(db, "users"),
        where("low_name", ">=", username)
      );
      const userSnapshot = await getDocs(q);
      const searchTerm = username.toLowerCase();
      if (!userSnapshot.empty) {
        const matchingUsers = userSnapshot.docs
          .map((doc) => doc.data() as User)
          .filter((user) => user.name.toLowerCase().includes(searchTerm));
        // Awant to store the entire user data object in state
        setUsers(matchingUsers);
        setErr(false);
      } else {
        setErr(true);
        console.error("User document not found in Firestore");
        setUsers([]);
      }
    } catch (error) {
      setErr(true);
      console.error("Error fetching user data from Firestore:", error);
    }
  };
  useEffect(() => {
    if (username.length === 0) {
      setErr(false);
      setUsers([]); // Clears the user info if the search input is empty
    }
    handleSearch();
  }, [username]);
  return (
    <>
      <div className="hidden relative lg:flex lg:flex-col h-10 items-center bg-slate-100 rounded-3xl w-2/5 border-[3px] border-transparent pl-3 focus-within:border-blue-500 transition-all duration-700">
        <div className="absolute left-3 top-1 pointer-events-none">
          <Search />
        </div>
        <Input
          className="pl-10 w-full h-8 bg-slate-100 rounded-3xl placeholder:text-muted-foreground border-0 text-md poppins-light focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
          placeholder="Search"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />

        {err && (
          <div className="flex flex-col items-center w-full">
            <div className="mt-2 border border-solid border-red-600 w-[50%] text-center text-red-600 bg-white shadow-lg divide-y divide-gray-200 rounded-lg overflow-hidden">
              <span className="poppins-regular">User not found.</span>
            </div>
          </div>
        )}
        {user.length > 0 && (
          <div
            ref={wrapperRef}
            className="flex flex-col items-center justify-center w-full"
          >
            <div className="mt-3 w-[70%] bg-white shadow-lg divide-y divide-gray-200 rounded-lg overflow-hidden">
              {/* Iterate through the users array to render each user */}
              {user.map((user) => (
                <Link
                  to={`/Profile/${user.uid}`}
                  key={user.uid}
                  className="no-underline text-black"
                >
                  <div
                    key={user.uid}
                    className="p-4 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="flex space-x-2 items-center">
                      <div>
                        {/* Assuming Avatar, AvatarImage, and AvatarFallback are components that can render based on the user data */}
                        <Avatar className="size-10 border-2">
                          <AvatarImage
                            src={user.ProfilePic || "default-avatar-url"}
                          />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="text-lg poppins-medium text-gray-900">
                          {user.name}
                        </h3>
                        {/* You can include other user details here */}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
