import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/src/app/hooks";
import { Link } from "react-router-dom";

//----------------------------------------------------//
export const ProfileView = () => {
  // const userId = useAppSelector((state) => state.profile.userId);
  const userName = useAppSelector((state) => state.profile.name);
  const profilePic = useAppSelector((state) => state.profile.picture);
  const userId = useAppSelector((state) => state.profile.userId);
  // setTimeout(() => {
  //   userName = useAppSelector((state) => state.profile.name);
  //   profilePic = useAppSelector((state) => state.profile.picture);
  //   userId = useAppSelector((state) => state.profile.userId);
  // }, 200);
  //const dispatch = useAppDispatch();
  //const [profilePic, setProfilePic] = useState<string>();
  // const fetchUserById = async (userId: string) => {
  //   try {
  //     const userQuery = query(
  //       collection(db, "users"),
  //       where("uid", "==", userId)
  //     );
  //     const userSnapshot = await getDocs(userQuery);

  //     if (!userSnapshot.empty) {
  //       const userData = userSnapshot.docs[0].data();
  //       const userName: string = userData?.name;
  //       const profile: string = userData?.ProfilePic;
  //       //setProfilePic(profile);
  //       localStorage.setItem("PicUrl", profile);
  //       localStorage.setItem("Name", userName);
  //       dispatch(updateName(userName));
  //       dispatch(updatePic(profile));
  //       console.log("I am runnning");
  //       return userData;
  //     } else {
  //       console.error("User document not found in Firestore");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data from Firestore:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   if (userId) {
  //     fetchUserById(userId);
  //   }
  // });

  return (
    <>
      <Link to={`/Profile/${userId}`}>
        <div className="flex items-center border-2 border-blue-400 shadow-xl rounded-xl p-2 bg-[#cbe3ec]">
          <Avatar className="size-12 ">
            <AvatarImage src={profilePic} />
            <AvatarFallback>{userName ? userName[0] : "U"}</AvatarFallback>
          </Avatar>
          <h2
            className="poppins-semibold pl-2 truncate"
            style={{ letterSpacing: "0.5px" }}
          >
            {userName}
          </h2>
        </div>
      </Link>
    </>
  );
};
