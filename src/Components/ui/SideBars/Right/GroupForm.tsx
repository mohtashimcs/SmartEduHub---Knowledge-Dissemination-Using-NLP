import { cn } from "@/lib/utils";
import {
  addDoc,
  arrayUnion,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, storage } from "@/src/Firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/src/app/hooks";
import { PacmanLoader } from "react-spinners";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function GroupForm({ className }: React.ComponentProps<"form">) {
  const userName = useAppSelector((state) => state.profile.name);
  const [loading, setIsLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const groupName = formData.get("groupName");
    const groupIconFile = formData.get("groupIcon");

    // Check if the group name already exists
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("name", "==", groupName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setIsLoading(false);
      alert("Group name already exists. Please enter a unique group name.");
      return; // Stop the function execution
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setIsLoading(false);
      console.error("No authenticated user found.");
      return; // Authentication check
    }

    const userUid = user.uid;

    if (groupIconFile instanceof File && groupName) {
      const fileRef = ref(storage, `groupIcons/${groupIconFile.name}`);
      uploadBytes(fileRef, groupIconFile)
        .then(async (snapshot) => {
          const groupIconURL = await getDownloadURL(snapshot.ref);

          // Create the group document in the "groups" collection
          const groupDocRef = await addDoc(collection(db, "groups"), {
            name: groupName,
            icon: groupIconURL,
            low_name: groupName.toString().toLowerCase(),
            createdBy: userName,
            admin: userUid,
            createdAt: serverTimestamp(),
          });
          // Add the user as a member of this group with their UID as the document ID
          const memberDocRef = doc(
            db,
            `groups/${groupDocRef.id}/members`,
            userUid
          );
          await setDoc(memberDocRef, {
            uid: userUid,
            joinedAt: serverTimestamp(),
            role: "admin",
          });

          // Add the group ID to the user's document in the "users" collection
          // const userDocRef = doc(db, "users", userUid);
          // await updateDoc(userDocRef, {
          //   groups: arrayUnion(groupDocRef.id), // Use arrayUnion to add the new group ID to the array
          // });
          const userDocQuery = query(
            collection(db, "users"),
            where("uid", "==", userUid)
          );
          const querySnapshot = await getDocs(userDocQuery);

          querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              groups: arrayUnion(groupDocRef.id),
            });
          });
          toast({
            className: "bg-[#87CEEB] poppins-bold",
            variant: "default",
            title: "Group Created Successfully!",
          });
          setIsLoading(false);
          window.location.reload();
        })
        .catch((error) => {
          setIsLoading(false);
          toast({
            className: "poppins-bold",
            variant: "destructive",
            title: "Error" + error.message,
          });
          console.error("Error: ", error);
        });
    } else {
      setIsLoading(false);
      console.error("Group icon and name are required");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center]">
          <PacmanLoader color="#36d7b7" />
        </div>
      ) : (
        <form
          className={cn("grid items-start gap-4 poppins-regular", className)}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid gap-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              type="text"
              id="groupName"
              placeholder="Enter Group Name"
              required
              name="groupName"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="groupIcon">Group Icon</Label>
            <Input
              type="file"
              id="groupIcon"
              name="groupIcon"
              required
              accept="image/*"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#89CFF3] poppins-semibold border-2 border-gray-500 text-black hover:bg-blue-400 hover:text-white"
          >
            Create Group
          </Button>
        </form>
      )}
    </>
  );
}
