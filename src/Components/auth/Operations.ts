import { signOut } from "firebase/auth";
import { auth } from "@/src/Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/src/app/hooks";
import { deleteData } from "@/src/app/features/ProfileSlice";

//---------------------------------------------------
const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    try {
      await signOut(auth); // Attempt to sign out using Firebase auth
      // Clearing local storage items
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
      localStorage.removeItem("category");
      localStorage.removeItem("user");
      localStorage.removeItem("PicUrl");
      dispatch(deleteData());
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      // Here, you might want to handle errors, maybe by showing a notification to the user
      toast({
        className: "poppins-bold",
        variant: "destructive",
        title: "Oh! Logout failed.",
        description: `${error}`,
      });
    }
  }, [navigate]); // Dependencies for useCallback

  return logout;
};

export default useLogout;
