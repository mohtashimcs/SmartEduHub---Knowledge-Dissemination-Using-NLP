import { cn } from "@/lib/utils";
import {
  addDoc,
  arrayUnion,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, storage } from "@/src/Firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/src/app/hooks";
import { useState } from "react";
import { PacmanLoader } from "react-spinners";
import { toast } from "@/components/ui/use-toast";

export function FileForm({ className }: React.ComponentProps<"form">) {
  const userName = useAppSelector((state) => state.profile.name);
  const [loading, setIsLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fileName = formData.get("fileName");
    const fileComment = formData.get("fileComment");
    const file = formData.get("doc");
    setIsLoading(true);

    // Check if the group name already exists
    const groupsRef = collection(db, "files");
    const q = query(groupsRef, where("title", "==", fileName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setIsLoading(false);
      toast({
        className: "poppins-bold",
        variant: "destructive",
        title: "Title already exists. Please enter a unique name.",
      });
      return; // Stop the function execution
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No authenticated user found.");
      return; // Authentication check
    }

    const userUid = user.uid;

    if (file instanceof File && fileName) {
      setIsLoading(true);
      const fileSize = (file.size / 1048576).toFixed(2).toString();
      const storageRef = ref(storage, `files/${fileName}`);
      // Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask
        .then((snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast({
            className: "bg-[#87CEEB] poppins-bold",
            variant: "default",
            title: "Upload is " + progress + "% done",
          });
          return getDownloadURL(storageRef);
        })
        .then((downloadURL) => {
          // On Upload Success: Store metadata in Firestore
          const filesCollectionRef = collection(db, "files");
          return addDoc(filesCollectionRef, {
            title: fileName,
            publisher: userName,
            publisher_uid: userUid,
            description: fileComment,
            downloadURL: downloadURL, // Get URL after upload
            size: fileSize,
            uploadedAt: new Date(),
          });
        })
        .then((docRef) => {
          const docId = docRef.id; // Get the document ID from the docRef
          toast({
            className: "bg-[#87CEEB] poppins-bold",
            variant: "default",
            title: "Success.",
            description: "File uploaded successfully. ",
          });
          // Update the document with the actual doc_id
          return updateDoc(docRef, { doc_id: docId }).then(() => docId);
        })
        .then(async (docId) => {
          const userDocQuery = query(
            collection(db, "users"),
            where("uid", "==", userUid)
          );
          const querySnapshot = await getDocs(userDocQuery);

          querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              files: arrayUnion(docId),
            });
          });
        })
        .catch((error) => {
          toast({
            className: "poppins-bold",
            variant: "destructive",
            title: "Error uploading file.",
            description: error,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      toast({
        className: "poppins-bold",
        variant: "destructive",
        title: "File and Title are required",
      });
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
            <Label htmlFor="fileName">Document Name</Label>
            <Input
              type="text"
              id="fileName"
              placeholder="Enter Document Title"
              required
              name="fileName"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fileComment">Remarks</Label>
            <Input
              type="text"
              id="fileComment"
              placeholder="Remarks on Selected Document"
              required
              name="fileComment"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="doc">Select Document</Label>
            <Input
              type="file"
              id="doc"
              name="doc"
              required
              accept="application/pdf"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#89CFF3] poppins-semibold text-black border-2 border-gray-500 hover:bg-blue-400 hover:text-white"
          >
            Upload Document
          </Button>
        </form>
      )}
    </>
  );
}
