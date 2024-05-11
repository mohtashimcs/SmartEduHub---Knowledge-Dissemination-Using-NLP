import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { storage, db } from "@/src/Firebase/firebase";
import { useAppSelector } from "@/src/app/hooks";
import imageCompression from "browser-image-compression";
import Autoplay from "embla-carousel-autoplay";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ArrowsUpFromLine, ImagePlus, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { PacmanLoader } from "react-spinners";

export const CreateView = () => {
  const [selectedFile, setSelectedFiles] = useState<File[]>([]);
  const [postText, setPostText] = useState("");
  const [loading, setIsLoading] = useState(false);

  // Adjust these values according to how you manage global state or configuration
  const userName = useAppSelector((state) => state.profile.name);
  const userId = useAppSelector((state) => state.profile.userId);
  const catg = useAppSelector((state) => state.profile.category);
  const profile = useAppSelector((state) => state.profile.picture);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (userId) {
  //       const userData = await fetchUserById(userId);
  //       if (userData) {
  //         setUserName(userData.name || "Default Name");
  //         localStorage.setItem("userName", userData.name || "Null");
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, [userId]);

  // const fetchUserById = async (userId: string) => {
  //   try {
  //     const userQuery = query(
  //       collection(db, "users"),
  //       where("uid", "==", userId)
  //     );
  //     const userSnapshot = await getDocs(userQuery);

  //     if (!userSnapshot.empty) {
  //       const userData = userSnapshot.docs[0].data();
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: any) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCreatePost = async (postText: string, selectedFiles: any) => {
    if ((postText.trim().length === 0 && selectedFiles.empty) || !userId) {
      //toast.error("Post cannot be empty.");
      toast({
        className: "bg-[#87CEEB] poppins-bold",
        variant: "destructive",
        title: "Posts cannot be empty",
      });
      return;
    }

    setIsLoading(true);
    const fileUrls = await Promise.all(
      selectedFiles.map(async (file: any) => {
        if (file.type.startsWith("image/")) {
          try {
            const compressedFile = await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 640,
              useWebWorker: true,
              preserveExif: true,
              initialQuality: 0.4,
            });
            return uploadFile(compressedFile);
          } catch (error) {
            console.error("Error compressing the image:", error);
            return null;
          }
        } else if (file.type.startsWith("video/")) {
          return uploadFile(file);
        } else {
          console.error("Unsupported file type:", file.type);
          return null;
        }
      })
    );

    const validUrls = fileUrls.filter((url) => url !== null);

    try {
      await addDoc(collection(db, "posts"), {
        userId: userId,
        content: postText.trim(),
        fileUrls: validUrls,
        createdAt: serverTimestamp(),
        userName: userName,
        category: catg,
        userPic: profile,
      });
      toast({
        className: "bg-[#87CEEB] poppins-bold",
        variant: "default",
        title: "Hurrah! Posted Successfully",
        description: "Your post has been published.",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        className: "poppins-bold",
        variant: "destructive",
        title: "Oh! Something went wrong.",
        description: "Post cannot be empty.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: any) => {
    // const fileType = file.type;

    const storageRef = ref(
      storage,
      `posts/${userId}/${Date.now()}_${file.name}`
    );
    const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
    return getDownloadURL(uploadTaskSnapshot.ref);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (postText.length == 0 && selectedFile.length == 0) {
      setIsLoading(false);
      toast({
        className: "poppins-bold",
        variant: "destructive",
        title: "Post cannot be empty.",
      });
      return;
    }
    await handleCreatePost(postText, selectedFile);
    setPostText("");
    setSelectedFiles([]);
    setIsLoading(false);
  };
  const textAreaAdjust = (element: HTMLTextAreaElement) => {
    element.style.height = "inherit";
    element.style.height = `${element.scrollHeight}px`;
  };
  return (
    <div className="w-[90%] h-fit">
      {loading ? (
        <div className="flex justify-center items-center]">
          <PacmanLoader color="#36d7b7" />
        </div>
      ) : (
        <Card className="border-2 shadow-2xl bg-[#c2e5f3]  border-gray-500 rounded-3xl">
          <CardHeader>
            <CardTitle>
              <div className="poppins-bold text-gray-900 flex flex-col">
                <span>Write Your Thoughts</span>
                <span className="text-sm font-extralight">{userName}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="items-center flex flex-col space-y-6">
            <Textarea
              className={
                "poppins-extralight px-6 placeholder:text-muted-foreground resize-none font-sans font-normal text-md bg-slate-100 rounded-3xl border-[2px] overflow-hidden border-[#cce9f5] focus-visible:ring-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0  text-gray focus-within:border-blue-700 transition-all duration-2000 text-gray outline-none shadow-inner"
              }
              onKeyUp={(e) => textAreaAdjust(e.target as HTMLTextAreaElement)}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Empower your voice, inspire the minds..."
            />
            {selectedFile.length !== 0 && (
              <Carousel
                className="max-w-sm mx-auto"
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
              >
                <CarouselContent>
                  {selectedFile.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative rounded-md overflow-hidden h-auto">
                        {selectedFile[index].type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(url)}
                            alt="Selected File"
                            className="w-full h-full object-cover"
                          />
                        ) : selectedFile[index].type.startsWith("video/") ? (
                          <video
                            controls
                            className="w-full h-full object-cover"
                          >
                            <source
                              src={URL.createObjectURL(url)}
                              type={selectedFile[index].type}
                            />
                          </video>
                        ) : (
                          <p>Unsupported file type</p>
                        )}
                        <button
                          className="absolute top-0 right-0 bg-transparent text-black border-2 border-gray-300 hover:bg-blue-50 cursor-pointer m-2"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X />
                        </button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {selectedFile &&
                  selectedFile.length > 1 && ( // Conditional rendering based on the number of items
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
              </Carousel>
            )}
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <label htmlFor="photoVid" className="">
              <span className="poppins-semibold bg-blue-200 flex items-center text-md px-2 py-2 h-10 text-blue-500 border-blue-400 border-2 rounded-md hover:bg-blue-50 cursor-pointer">
                <ImagePlus className="pr-1 text-blue-900" />
                Photo/Video
              </span>
              <input
                type="file"
                id="photoVid"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </label>
            <Button
              className="poppins-semibold bg-red-100 text-md px-2 py-2 h-10 text-red-500 border-red-400 border-2 rounded-md hover:bg-blue-50 cursor-pointer"
              onClick={handleSubmit}
            >
              <ArrowsUpFromLine className="pr-1" />
              Post
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
