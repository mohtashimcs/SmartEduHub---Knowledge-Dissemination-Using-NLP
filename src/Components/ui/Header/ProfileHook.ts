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
  const [displayName, setDisplayName] = useState("");
  const [dP, setdP] = useState("");
  const [categ, setCateg] = useState("");

  const userId = useAppSelector((state) => state.profile.userId);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", userId)
          );
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              setDisplayName(data.name);
              setdP(data.ProfilePic);
              setCateg(data.category);
            });
          }
        } catch (error) {
          console.error("Error fetching user profile: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [userId]);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleSave = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", userId)
      );
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const userRef = doc.ref;
          await updateDoc(userRef, {
            name: displayName,
            category: categ,
            low_name: displayName.toLowerCase(),
          });
          localStorage.setItem("category", categ);
          localStorage.setItem("Name", displayName);
          dispatch(updateCategory(categ));
          dispatch(updateName(displayName));
        });
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (file: any) => {
    if (!userId || !file) return;
    setIsLoading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Error uploading file: ", error);
          setIsLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              try {
                setIsLoading(true);
                const userQuery = query(
                  collection(db, "users"),
                  where("uid", "==", userId)
                );
                const querySnapshot = await getDocs(userQuery);
                if (!querySnapshot.empty) {
                  querySnapshot.forEach(async (doc) => {
                    const userRef = doc.ref;
                    await updateDoc(userRef, { ProfilePic: downloadURL });
                    localStorage.setItem("PicUrl", downloadURL);
                    dispatch(updatePic(downloadURL));
                    setdP(downloadURL);
                  });
                }
              } catch (error) {
                console.error("Error updating user profile: ", error);
              } finally {
                setIsLoading(false);
              }
            })
            .catch((error) => {
              console.error("Error getting download URL: ", error);
              setIsLoading(false);
            });
        }
      );
    } catch (error) {
      console.error("Error uploading profile picture: ", error);
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
