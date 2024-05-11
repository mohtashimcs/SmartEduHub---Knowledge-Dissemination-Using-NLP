import { useState, useEffect } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/src/Firebase/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useAppDispatch, useAppSelector } from "@/src/app/hooks";
import {
  updateCategory,
  updateName,
  updatePic,
} from "@/src/app/features/ProfileSlice";

const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("Name") || "Null"
  );
  const [dP, setdP] = useState(localStorage.getItem("PicUrl") || "Null");
  const [categ, setCateg] = useState(
    localStorage.getItem("category") || "Null"
  );
  const userId = useAppSelector((state) => state.profile.userId);

  useEffect(() => {
    // You can also load initial profile data here if necessary
    setDisplayName(localStorage.getItem("Name") || "Null");
    setdP(localStorage.getItem("PicUrl") || "Null");
    setCateg(localStorage.getItem("category") || "Null");
  }, [userId]);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleSave = async () => {
    if (!userId) return; // Ensure there's a user UID available
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", userId)
    );

    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        return;
      }

      querySnapshot.forEach((doc) => {
        const userRef = doc.ref;
        updateDoc(userRef, {
          name: displayName,
          category: categ,
          low_name: displayName.toLowerCase(),
        })
          .then(() => {
            localStorage.setItem("category", categ);
            localStorage.setItem("Name", displayName);
            dispatch(updateCategory(categ));
            dispatch(updateName(displayName));
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching documents: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (file: any) => {
    setIsLoading(true);
    if (!userId || !file) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", userId)
          );
          const querySnapshot = await getDocs(userQuery);
          if (querySnapshot.empty) {
            return;
          }
          querySnapshot.forEach((doc) => {
            const userRef = doc.ref;
            updateDoc(userRef, { ProfilePic: downloadURL })
              .then(() => {
                localStorage.setItem("PicUrl", downloadURL);
                const a: string = localStorage.getItem("PicUrl") || "";
                dispatch(updatePic(a));
                setdP(downloadURL);
              })
              .catch((error) => {
                console.error("Error updating user's profile", error);
              });
          });
        });
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return {
    loading,
    isEditable,
    displayName,
    dP,
    categ,
    toggleEdit,
    handleSave,
    handleProfilePictureUpload,
    setDisplayName,
    setCateg,
  };
};

export default useUserProfile;
